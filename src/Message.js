/* eslint-disable class-methods-use-this, no-unused-vars */
import isArray from 'lodash/isArray';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import isMap from 'lodash/isMap';
import toSafeInteger from 'lodash/toSafeInteger';
import trim from 'lodash/trim';
import AssertionFailed from './Exception/AssertionFailed';
import FrozenMessageIsImmutable from './Exception/FrozenMessageIsImmutable';
import LogicException from './Exception/LogicException';
import RequiredFieldNotSet from './Exception/RequiredFieldNotSet';
import SchemaNotDefined from './Exception/SchemaNotDefined';
import MessageRef from './MessageRef';
import Schema, { PBJ_FIELD_NAME } from './Schema';
import JsonSerializer from './Serializer/JsonSerializer';
import ObjectSerializer from './Serializer/ObjectSerializer';

/**
 * Stores all message instances so data is kept
 * private and cannot be mutated directly.
 *
 * @type {WeakMap}
 */
const msgs = new WeakMap();

/**
 * Schemas only need to be defined once per message.
 * This maps contains all references, keyed by the
 * message class itself.
 *
 * @type {Map}
 */
const schemas = new Map();

/**
 * Ensures a frozen message can't be modified.
 *
 * @param {Message} message
 *
 * @throws {FrozenMessageIsImmutable}
 */
function guardFrozenMessage(message) {
  if (message.isFrozen()) {
    throw new FrozenMessageIsImmutable(message);
  }
}

/**
 * Populates the default on a single field if it's not already set
 * and the default generated is not a null value or empty array.
 *
 * @param {Message} message
 * @param {Field} field
 *
 * @returns {boolean} Returns true if a non null/empty default was applied or already present.
 */
function populateDefault(message, field) {
  const fieldName = field.getName();
  if (message.has(fieldName)) {
    return true;
  }

  const defaultValue = field.getDefault(message);
  if (defaultValue === null) {
    return false;
  }

  const msg = msgs.get(message);

  if (field.isASingleValue()) {
    msg.data.set(fieldName, defaultValue);
    msg.clearedFields.delete(fieldName);
    return true;
  }

  if (isEmpty(defaultValue)) {
    return false;
  }

  if (field.isASet()) {
    message.addToSet(fieldName, Array.from(defaultValue));
    return true;
  }

  msg.data.set(fieldName, defaultValue);
  msg.clearedFields.delete(fieldName);
  return true;
}

export default class Message {
  /**
   * Nothing fancy on new messages... we let the serializers or application code get fancy.
   */
  constructor() {
    msgs.set(this, {
      /** @var {Map} */
      data: new Map(),

      /**
       * A set of fields that have been cleared or set to null that
       * must be included when serialized so it's clear that the
       * value has been unset.
       *
       * @var {Set}
       */
      clearedFields: new Set(),

      /**
       * @see Message.freeze
       *
       * @var {boolean}
       */
      isFrozen: false,

      /**
       * @see Message.isReplay
       *
       * @var {?boolean}
       */
      isReplay: null,
    });
  }

  /**
   * @returns {Schema}
   *
   * @throws {SchemaNotDefined}
   */
  static schema() {
    if (!schemas.has(this)) {
      const schema = this.defineSchema();

      if (!(schema instanceof Schema)) {
        throw new SchemaNotDefined(
          `Message [${this.name}] must return a Schema from the defineSchema method.`,
        );
      }

      if (schema.getClassProto() !== this) {
        throw new SchemaNotDefined(
          `Schema [${schema.getId()}] returned from defineSchema must be for class [${this.name}], not [${schema.getClassProto().name}].`,
        );
      }

      schemas.set(this, schema);
      return schema;
    }

    return schemas.get(this);
  }

  /**
   * @private
   *
   * @returns {Schema}
   *
   * @throws {SchemaNotDefined}
   */
  static defineSchema() {
    throw new SchemaNotDefined(`Message [${this.constructor.name}] must return a Schema from the defineSchema method.`);
  }

  /**
   * @returns {Schema}
   */
  schema() {
    return this.constructor.schema();
  }

  /**
   * Creates a new message with the defaults populated.
   *
   * @returns {Message}
   */
  static create() {
    const message = new this();
    return message.populateDefaults();
  }

  /**
   * Returns a new message from the provided object using the ObjectSerializer.
   * @see ObjectSerializer.deserialize
   *
   * @param {Object} obj
   *
   * @returns {Message}
   *
   * @throws {AssertionFailed}
   */
  static fromObject(obj = {}) {
    if (!obj[PBJ_FIELD_NAME]) {
      // eslint-disable-next-line no-param-reassign
      obj[PBJ_FIELD_NAME] = this.schema().getId().toString();
    }

    return ObjectSerializer.deserialize(obj);
  }

  /**
   * Generates an md5 hash of the json representation of the current message.
   *
   * @param {string[]} ignoredFields
   *
   * @returns {string}
   */
  generateEtag(ignoredFields = []) {
    // if (null === self::$serializer) {
    //     self::$serializer = new PhpArraySerializer();
    // }
    // $array = self::$serializer->serialize($this, ['includeAllFields' => true]);
    //
    // if (empty($ignoredFields)) {
    //     return md5(json_encode($array));
    // }
    //
    // foreach ($ignoredFields as $field) {
    //     unset($array[$field]);
    // }
    //
    // return md5(json_encode($array));

    return 'notanetag';
  }

  /**
   * Generates a reference to this message with an optional tag.
   * This method must be implemented in the concrete class or a mixin.
   *
   * @param {?string} tag
   *
   * @returns {MessageRef}
   */
  generateMessageRef(tag = null) {
    throw new LogicException('You must implement "generateMessageRef" in your schema.');
  }

  /**
   * Returns an object that can be used in a uri template to generate
   * a uri/url for this message.
   *
   * @link https://tools.ietf.org/html/rfc6570
   * @link https://medialize.github.io/URI.js/uri-template.html
   *
   * @returns {Object}
   */
  getUriTemplateVars() {
    return {};
  }

  /**
   * Verifies all required fields have been populated.
   * todo: recursively validate nested messages?
   *
   * @returns {Message}
   *
   * @throws {RequiredFieldNotSet}
   */
  validate() {
    this.schema().getRequiredFields().forEach((field) => {
      if (!this.has(field.getName())) {
        throw new RequiredFieldNotSet(this, field);
      }
    });

    return this;
  }

  /**
   * Freezes the message, making it immutable.  The message must be valid
   * before it can be frozen so this may throw an exception if some required
   * fields have not been populated.
   *
   * @returns {Message}
   *
   * @throws {RequiredFieldNotSet}
   */
  freeze() {
    if (this.isFrozen()) {
      return this;
    }

    this.validate();
    const msg = msgs.get(this);
    msg.isFrozen = true;

    this.schema().getFields().forEach((field) => {
      if (!field.getType().isMessage()) {
        return;
      }

      /** @var {Message|Message[]} value */
      const value = this.get(field.getName());
      if (value instanceof Message) {
        value.freeze();
        return;
      }

      if (isEmpty(value)) {
        return;
      }

      if (field.isAMap()) {
        Object.keys(value).forEach(k => value[k].freeze());
        return;
      }

      value.forEach(m => m.freeze());
    });

    return this;
  }

  /**
   * Returns true if the message has been frozen.  A frozen message is
   * immutable and cannot be modified.
   *
   * @returns {boolean}
   */
  isFrozen() {
    return msgs.get(this).isFrozen;
  }

  /**
   * Returns true if the data of the message matches.
   *
   * @param {Message} other
   *
   * @returns {boolean}
   */
  equals(other) {
    // This could probably use some work.  :)  low level serialization string match.
    return `${this}` === `${other}`;
  }

  /**
   * Returns true if this message is being replayed.  Providing a value
   * will set the flag but this can only be done once.  Note that
   * setting a message as being "replayed" will also freeze the message.
   *
   * @param {?boolean} replay
   *
   * @returns {boolean}
   *
   * @throws {LogicException}
   */
  isReplay(replay = null) {
    const msg = msgs.get(this);

    if (replay === null) {
      if (msg.isReplay === null) {
        msg.isReplay = false;
      }

      return msg.isReplay;
    }

    if (msg.isReplay === null) {
      msg.isReplay = isBoolean(replay) ? replay : false;
      if (msg.isReplay) {
        this.freeze();
      }

      return msg.isReplay;
    }

    throw new LogicException('You can only set the replay mode "on" one time.');
  }

  /**
   * Populates the defaults on all fields or just the fieldName provided.
   * Operation will NOT overwrite any fields already set.
   *
   * @param {?string} fieldName
   *
   * @returns {Message}
   */
  populateDefaults(fieldName = null) {
    guardFrozenMessage(this);

    if (!isEmpty(fieldName)) {
      populateDefault(this, this.schema().getField(fieldName));
      return this;
    }

    this.schema().getFields().forEach(field => populateDefault(this, field));
    return this;
  }

  /**
   * Returns true if the field has been populated.
   *
   * @param {string} fieldName
   *
   * @returns {boolean}
   */
  has(fieldName) {
    const msg = msgs.get(this);
    if (!msg.data.has(fieldName)) {
      return false;
    }

    const value = msg.data.get(fieldName);
    if (isArray(value) || isMap(value)) {
      return !isEmpty(value);
    }

    return value !== null && value !== undefined;
  }

  /**
   * Returns the value for the given field.  If the field has not
   * been set you will get a null value.
   *
   * @param {string} fieldName
   * @param {*} defaultValue
   *
   * @returns {*}
   */
  get(fieldName, defaultValue = null) {
    if (!this.has(fieldName)) {
      return defaultValue;
    }

    const field = this.schema().getField(fieldName);
    const msg = msgs.get(this);

    if (field.isASingleValue()) {
      return msg.data.get(fieldName);
    }

    if (field.isAList()) {
      return [...msg.data.get(fieldName)];
    }

    // a set is stored as a Map internally but really
    // is just a simple array when serialized.
    if (field.isASet()) {
      return Array.from(msg.data.get(fieldName).values());
    }

    // maps must return as a plain object.
    const obj = {};
    msg.data.get(fieldName).forEach((v, k) => obj[k] = v); // eslint-disable-line no-return-assign
    return obj;
  }

  /**
   * Clears the value of a field.
   *
   * @param {string} fieldName
   *
   * @returns {Message}
   */
  clear(fieldName) {
    guardFrozenMessage(this);
    const field = this.schema().getField(fieldName);
    const msg = msgs.get(this);
    msg.data.delete(fieldName);
    msg.clearedFields.add(fieldName);
    populateDefault(this, field);
    return this;
  }

  /**
   * Returns true if the field has been cleared.
   *
   * @param {string} fieldName
   *
   * @returns {boolean}
   */
  hasClearedField(fieldName) {
    return msgs.get(this).clearedFields.has(fieldName);
  }

  /**
   * Returns an array of field names that have been cleared.
   *
   * @returns {string[]}
   */
  getClearedFields() {
    return Array.from(msgs.get(this).clearedFields.values());
  }

  /**
   * Sets a single value field.
   *
   * @param {string} fieldName
   * @param {*} value
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  set(fieldName, value) {
    guardFrozenMessage(this);
    const field = this.schema().getField(fieldName);
    if (!field.isASingleValue()) {
      throw new AssertionFailed(`Field [${fieldName}] must be a single value.`);
    }

    if (value === null) {
      return this.clear(fieldName);
    }

    field.guardValue(value);
    const msg = msgs.get(this);
    msg.data.set(fieldName, value);
    msg.clearedFields.delete(fieldName);

    return this;
  }

  /**
   * Returns true if the provided value is in the set of values.
   *
   * @param {string} fieldName
   * @param {*} value
   *
   * @returns {boolean}
   */
  isInSet(fieldName, value) {
    if (!this.has(fieldName)) {
      return false;
    }

    /** @var {string} key */
    const key = trim(value);
    if (!key.length) {
      return false;
    }

    return msgs.get(this).data.get(fieldName).has(key.toLowerCase());
  }

  /**
   * Adds an array of unique values to an unsorted set of values.
   *
   * @param {string} fieldName
   * @param {Array} values
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  addToSet(fieldName, values) {
    guardFrozenMessage(this);
    const field = this.schema().getField(fieldName);
    if (!field.isASet()) {
      throw new AssertionFailed(`Field [${fieldName}] must be a set.`);
    }

    const msg = msgs.get(this);
    if (!msg.data.has(fieldName)) {
      msg.data.set(fieldName, new Map());
    }

    const store = msg.data.get(fieldName);
    values.forEach((value) => {
      /** @var {string} key */
      const key = trim(value);
      if (!key.length) {
        return;
      }

      field.guardValue(value);
      store.set(key.toLowerCase(), value);
    });

    if (store.size) {
      msg.clearedFields.delete(fieldName);
    }

    return this;
  }

  /**
   * Removes an array of values from a set.
   *
   * @param {string} fieldName
   * @param {Array} values
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  removeFromSet(fieldName, values) {
    guardFrozenMessage(this);
    const field = this.schema().getField(fieldName);
    if (!field.isASet()) {
      throw new AssertionFailed(`Field [${fieldName}] must be a set.`);
    }

    const msg = msgs.get(this);
    if (!msg.data.has(fieldName)) {
      msg.clearedFields.add(fieldName);
      return this;
    }

    const store = msg.data.get(fieldName);
    values.forEach((value) => {
      /** @var {string} key */
      const key = trim(value);
      if (!key.length) {
        return;
      }

      store.delete(key.toLowerCase());
    });

    if (!store.size) {
      msg.data.delete(fieldName);
      msg.clearedFields.add(fieldName);
    }

    return this;
  }

  /**
   * Returns true if the provided value is in the list of values.
   * Uses SameValueZero for comparison.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes?v=control
   *
   * @param {string} fieldName
   * @param {*} value
   *
   * @returns {boolean}
   */
  isInList(fieldName, value) {
    if (!this.has(fieldName)) {
      return false;
    }

    return msgs.get(this).data.get(fieldName).includes(value);
  }

  /**
   * Returns an item in a list or null if it doesn't exist.
   *
   * @param {string} fieldName
   * @param {number} index
   * @param {*} defaultValue
   *
   * @returns {*}
   */
  getFromListAt(fieldName, index, defaultValue = null) {
    if (!this.has(fieldName)) {
      return defaultValue;
    }

    const value = msgs.get(this).data.get(fieldName)[toSafeInteger(index)];
    return value === undefined ? defaultValue : value;
  }

  /**
   * Adds an array of values to an unsorted list/array (not unique).
   *
   * @param {string} fieldName
   * @param {Array} values
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  addToList(fieldName, values) {
    guardFrozenMessage(this);
    const field = this.schema().getField(fieldName);
    if (!field.isAList()) {
      throw new AssertionFailed(`Field [${fieldName}] must be a list.`);
    }

    const msg = msgs.get(this);
    if (!msg.data.has(fieldName)) {
      msg.data.set(fieldName, []);
    }

    const store = msg.data.get(fieldName);
    values.forEach((value) => {
      field.guardValue(value);
      store.push(value);
    });

    if (store.length) {
      msg.clearedFields.delete(fieldName);
    }

    return this;
  }

  /**
   * Removes the element from the array at the index.
   *
   * @param {string} fieldName
   * @param {number} index
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  removeFromListAt(fieldName, index) {
    guardFrozenMessage(this);
    const field = this.schema().getField(fieldName);
    if (!field.isAList()) {
      throw new AssertionFailed(`Field [${fieldName}] must be a list.`);
    }

    const msg = msgs.get(this);
    if (!msg.data.has(fieldName)) {
      msg.clearedFields.add(fieldName);
      return this;
    }

    const store = msg.data.get(fieldName);
    store.splice(toSafeInteger(index), 1);

    if (!store.length) {
      msg.data.delete(fieldName);
      msg.clearedFields.add(fieldName);
    }

    return this;
  }

  /**
   * Returns true if the map contains the provided key.
   *
   * @param {string} fieldName
   * @param {string} key
   *
   * @returns {boolean}
   */
  isInMap(fieldName, key) {
    if (!this.has(fieldName)) {
      return false;
    }

    return msgs.get(this).data.get(fieldName).has(key);
  }

  /**
   * Returns the value of a key in a map or null if it doesn't exist.
   *
   * @param {string} fieldName
   * @param {string} key
   * @param {*} defaultValue
   *
   * @returns {*}
   */
  getFromMap(fieldName, key, defaultValue = null) {
    if (!this.isInMap(fieldName, key)) {
      return defaultValue;
    }

    return msgs.get(this).data.get(fieldName).get(key);
  }

  /**
   * Adds a key/value pair to a map.
   *
   * @param {string} fieldName
   * @param {string} key
   * @param {*} value
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  addToMap(fieldName, key, value) {
    guardFrozenMessage(this);
    const field = this.schema().getField(fieldName);
    if (!field.isAMap()) {
      throw new AssertionFailed(`Field [${fieldName}] must be a map.`);
    }

    if (value === null) {
      return this.removeFromMap(fieldName, key);
    }

    const msg = msgs.get(this);
    if (!msg.data.has(fieldName)) {
      msg.data.set(fieldName, new Map());
    }

    const store = msg.data.get(fieldName);
    field.guardValue(value);
    store.set(key, value);
    msg.clearedFields.delete(fieldName);

    return this;
  }

  /**
   * Removes a key/value pair from a map.
   *
   * @param {string} fieldName
   * @param {string} key
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  removeFromMap(fieldName, key) {
    guardFrozenMessage(this);
    const field = this.schema().getField(fieldName);
    if (!field.isAMap()) {
      throw new AssertionFailed(`Field [${fieldName}] must be a map.`);
    }

    const msg = msgs.get(this);
    if (!msg.data.has(fieldName)) {
      msg.clearedFields.add(fieldName);
      return this;
    }

    const store = msg.data.get(fieldName);
    store.delete(key);

    if (!store.size) {
      msg.data.delete(fieldName);
      msg.clearedFields.add(fieldName);
    }

    return this;
  }

  /**
   * @returns {string}
   */
  toString() {
    return JsonSerializer.serialize(this);
  }

  /**
   * @returns {Object}
   */
  toObject() {
    return ObjectSerializer.serialize(this);
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * @returns {string}
   */
  valueOf() {
    return this.toString();
  }

  /**
   * @returns {Message}
   */
  clone() {
    return ObjectSerializer.deserialize(ObjectSerializer.serialize(this));
  }
}
