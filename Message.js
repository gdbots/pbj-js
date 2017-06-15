/* eslint-disable */
import isBoolean from 'lodash-es/isBoolean';
import isEmpty from 'lodash-es/isEmpty';
import trim from 'lodash-es/trim';
import AssertionFailed from './Exception/AssertionFailed';
import FrozenMessageIsImmutable from './Exception/FrozenMessageIsImmutable';
import LogicException from './Exception/LogicException';
import RequiredFieldNotSet from './Exception/RequiredFieldNotSet';
import SchemaNotDefined from './Exception/SchemaNotDefined';
import MessageRef from './MessageRef';
import Schema, { PBJ_FIELD_NAME } from './Schema';

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
       * @var {boolean}
       */
      isReplay: false
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
        throw new SchemaNotDefined(`Message [${this.name}] must return a Schema from the defineSchema method.`);
      }

      if (schema.getClassProto() !== this) {
        throw new SchemaNotDefined(`Schema [${schema.getId()}] returned from defineSchema must be for class [${this.name}], not [${schema.getClassProto().name}].`);
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
    const msg = new this();
    return msg.populateDefaults();
  }

  /**
   * Returns a new message from the provided object using the JsonSerializer.
   * @see \Gdbots\Pbj\Serializer\PhpArraySerializer::deserialize
   *
   * @param {Object} obj
   *
   * @returns {MessageRef}
   *
   * @throws {AssertionFailed}
   */
  static fromObject(obj) {}
  // if (obj.curie && obj.id) {
  //   return new MessageRef(SchemaCurie.fromString(obj.curie), obj.id, obj.tag || null);
  // }
  //
  // throw new AssertionFailed('MessageRef is invalid.');
  //
  // if (null === self::$serializer) {
  //     self::$serializer = new PhpArraySerializer();
  // }
  //
  // if (!isset($data[Schema::PBJ_FIELD_NAME])) {
  //     $data[Schema::PBJ_FIELD_NAME] = static::schema()->getId()->toString();
  // }
  //
  // $message = self::$serializer->deserialize($data);
  // return $message;


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
   * @return {Object}
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
    this.schema().getRequiredFields().forEach(field => {
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

    this.schema().getFields().forEach(field => {
      if (!field.getType().isMessage()) {
        return;
      }

      /** @var {Message} value */
      const value = this.get(field.getName());
      if (isEmpty(value)) {
        return;
      }

      if (value instanceof Message) {
        value.freeze();
        return;
      }

      // fixme: deal with array/map/set?
      value.forEach(v => v.freeze());
    });

    return this;
  }

  /**
   * Recursively unfreezes this object and any of its children.
   * Used internally during the clone process.
   *
   * fixme: may not be needed in js (copied from php)
   *
   * @private
   */
  unFreeze() {
    const msg = msgs.get(this);
    msg.isFrozen = false;
    msg.isReplay = null;

    //
    // foreach (static::schema()->getFields() as $field) {
    //     if ($field->getType()->isMessage()) {
    //         /** @var self $value */
    //         $value = $this->get($field->getName());
    //         if (empty($value)) {
    //             continue;
    //         }
    //
    //         if ($value instanceof Message) {
    //             $value->unFreeze();
    //             continue;
    //         }
    //
    //         /** @var self $v */
    //         foreach ($value as $v) {
    //             $v->unFreeze();
    //         }
    //     }
    // }
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
   * Ensures a frozen message can't be modified.
   *
   * @private
   *
   * @throws {FrozenMessageIsImmutable}
   */
  guardFrozenMessage() {
    if (this.isFrozen()) {
      throw new FrozenMessageIsImmutable(this);
    }
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
    return this.toString() === other.toString();
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
    this.guardFrozenMessage();

    if (!isEmpty(fieldName)) {
      this.populateDefault(this.schema().getField(fieldName));
      return this;
    }

    this.schema().getFields().forEach(field => this.populateDefault(field));
    return this;
  }

  /**
   * Populates the default on a single field if it's not already set
   * and the default generated is not a null value or empty array.
   *
   * @private
   *
   * @param {Field} field
   *
   * @returns {boolean} Returns true if a non null/empty default was applied or already present.
   */
  populateDefault(field) {}

  // if ($this->has($field->getName())) {
  //     return true;
  // }
  //
  // $default = $field->getDefault($this);
  // if (null === $default) {
  //     return false;
  // }
  //
  // if ($field->isASingleValue()) {
  //     $this->data[$field->getName()] = $default;
  //     unset($this->clearedFields[$field->getName()]);
  //     return true;
  // }
  //
  // if (empty($default)) {
  //     return false;
  // }
  //
  // /*
  //  * sets have a special handling to deal with unique values
  //  */
  // if ($field->isASet()) {
  //     $this->addToSet($field->getName(), $default);
  //     return true;
  // }
  //
  // $this->data[$field->getName()] = $default;
  // unset($this->clearedFields[$field->getName()]);
  // return true;


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

    return !isEmpty(msg.data.get(fieldName));
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

    if (field.isASingleValue() || field.isAList()) {
      return msg.data.get(fieldName);
    }

    // a set is stored as a Map internally but really
    // is just a simple array when serialized.
    if (field.isASet()) {
      return Array.from(msg.data.get(fieldName).values());
    }

    // maps must return as a plain object.
    const obj = {};
    msg.data.get(fieldName).forEach((v, k) => obj[k] = v);
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
    this.guardFrozenMessage();
    const field = this.schema().getField(fieldName);
    const msg = msgs.get(this);
    msg.data.delete(fieldName);
    msg.clearedFields.add(fieldName);
    this.populateDefault(field);
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
    this.guardFrozenMessage();
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
   *
   * @throws {GdbotsPbjException}
   */
  isInSet(fieldName, value) {
    if (!this.has(fieldName)) {
      return false;
    }

    const field = this.schema().getField(fieldName);
    if (!field.isASet()) {
      throw new AssertionFailed(`Field [${fieldName}] must be a set.`);
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
    this.guardFrozenMessage();
    const field = this.schema().getField(fieldName);
    if (!field.isASet()) {
      throw new AssertionFailed(`Field [${fieldName}] must be a set.`);
    }

    const msg = msgs.get(this);
    if (!msg.data.has(fieldName)) {
      msg.data.set(fieldName, new Map());
    }

    const store = msg.data.get(fieldName);
    values.forEach(value => {
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
    this.guardFrozenMessage();
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
    values.forEach(value => {
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
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this);
  }

  /**
   * @returns {Object}
   */
  toObject() {
    // if (null === self::$serializer) {
    //     self::$serializer = new PhpArraySerializer();
    // }
    // return self::$serializer->serialize($this);
    return { _schema: this.schema().getId().toString() };
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
    // $this->data = unserialize(serialize($this->data));
    // $this->unFreeze();
    return {};
  }
}