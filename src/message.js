'use strict';

import FromArray from 'gdbots/common/from-array';
import ToArray from 'gdbots/common/to-array';
import ArrayUtils from 'gdbots/common/util/array-utils';
import StringUtils from 'gdbots/common/util/string-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import SchemaNotDefined from 'gdbots/pbj/exception/schema-not-defined';
import RequiredFieldNotSet from 'gdbots/pbj/exception/required-field-not-set';
import FrozenMessageIsImmutable from 'gdbots/pbj/exception/frozen-message-is-immutable';
import LogicException from 'gdbots/pbj/exception/logic-exception';
import ArraySerializer from 'gdbots/pbj/serializer/array-serializer';
import {default as Schema, PBJ_FIELD_NAME} from 'gdbots/pbj/schema';

/**
 * An array of schemas per message type.
 * ['Fully\Qualified\ClassName' => [ array of Schema objects ]
 *
 * @var array
 */
let schemas = {};

/** @var ArraySerializer */
let serializer = null;

export default class Message extends SystemUtils.mixin(FromArray, ToArray)
{
  /**
   * Nothing fancy on new messages... we let the serializers or application code get fancy.
   */
  constructor() {
    super(); // require before using `this`

    /** @var array */
    this.data = {};

    /**
     * An array of fields that have been cleared or set to null that
     * must be included when serialized so it's clear that the
     * value has been unset.
     *
     * @var array
     */
    this.clearedFields = [];

    /**
     * @see Message::freeze
     *
     * @var bool
     */
    this.isFrozen = false;

    /**
     * @see Message::isReplay
     *
     * @var bool
     */
    this.isReplay = false;
  }

  /**
   * @return Schema
   *
   * @throws SchemaNotDefined
   */
  static schema() {
    let type = this.name;
    if (undefined !== schemas[type]) {
      return schemas[type];
    }

    let schema = this.defineSchema();
    if (!(schema instanceof Schema)) {
      throw new SchemaNotDefined('Message [' + type + '] must return a Schema from the defineSchema method.');
    }

    if (schema.getClassName() !== type) {
      throw new SchemaNotDefined('Schema [' + schema.getId().toString() + '] returned from defineSchema must be for class [' + type + '], not [' + schema.getClassName() + ']');
    }

    schemas[type] = schema;
    return schemas[type];
  }

  /**
   * @return Schema
   *
   * @throws SchemaNotDefined
   */
  static defineSchema() {
    throw new SchemaNotDefined('Message [' + this.name + '] must return a Schema from the defineSchema method.');
  }

  /**
   * Creates a new message with the defaults populated.
   *
   * @return static
   */
  static create() {
    /** @var Message message */
    let message = new this();
    return message.populateDefaults();
  }

  /**
   * Returns a new message from the provided array using the Array Serializer.
   * @see Gdbots\Pbj\Serializer\ArraySerializer::deserialize
   *
   * @param array data
   *
   * @return static
   */
  static fromArray(data = {}) {
    if (null === serializer) {
      serializer = new ArraySerializer();
    }

    if (undefined === data[PBJ_FIELD_NAME]) {
      data[PBJ_FIELD_NAME] = this.schema().getId().toString();
    }

    return serializer.deserialize(data);
  }

  /**
   * Returns the message as an associative array using the Array Serializer.
   * @see Gdbots\Pbj\Serializer\ArraySerializer::serialize
   *
   * @return array
   */
  toArray() {
    if (null === serializer) {
      serializer = new ArraySerializer();
    }

    return serializer.serialize(this);
  }

  /**
   * Returns a Yaml string version of the message.
   * Useful for debugging or logging.
   *
   * @param array options
   *
   * @return string
   */
  toYaml(options = {}) {
    throw new Error('Not yet implemented.');
  }

  /**
   * Returns the message as a human readable string.
   *
   * @return string
   */
  toString() {
    return this.toArray();
  }

  /**
   * Generates an md5 hash of the json representation of the current message.
   *
   * @param string[] ignoredFields
   *
   * @return string
   */
  generateEtag(ignoredFields = []) {
    if (null === serializer) {
      serializer = new ArraySerializer();
    }

    let array = serializer.serialize(this, { 'includeAllFields': true });

    if (ignoredFields.length === 0) {
      return StringUtils.md5(JSON.stringify(array));
    }

    ArrayUtils.each(ignoredFields, function(value, key) {
      delete array[ignoredFields[key]];
    });

    return StringUtils.md5(JSON.stringify(array));
  }

  /**
   * Generates a reference to this message with an optional tag.
   *
   * @param string tag
   *
   * @return MessageRef
   */
  generateMessageRef(tag = null) {
    throw new Error('Interface function.');
  }

  /**
   * Returns an array that can be used in a uri template to generate
   * a uri/url for this message.
   * @link https://tools.ietf.org/html/rfc6570
   * @link https://github.com/gdbots/uri-template-php
   *
   * @return array
   */
  getUriTemplateVars() {
    throw new Error('Interface function.');
  }

  /**
   * Verifies all required fields have been populated.
   *
   * @return static
   *
   * @throws GdbotsPbjException
   * @throws RequiredFieldNotSet
   */
  validate() {
    ArrayUtils.each(this.constructor.schema().getRequiredFields(), function(field) {
      if (!this.has(field.getName())) {
        throw new RequiredFieldNotSet(this, field);
      }
    }.bind(this));

    return this;
  }

  /**
   * Freezes the message, making it immutable. The message must be valid
   * before it can be frozen so this may throw an exception if some required
   * fields have not been populated.
   *
   * @return static
   *
   * @throws GdbotsPbjException
   * @throws RequiredFieldNotSet
   */
  freeze() {
    if (this.isFrozen()) {
        return this;
    }

    this.validate();
    this.isFrozen = true;

    ArrayUtils.each(this.constructor.schema().getFields(), function(field) {
      if (field.getType().isMessage()) {
        /** @var self value */
        let value = this.get(field.getName());
        if (!value || value.length === 0) {
          return;
        }

        if (value instanceof Message) {
          value.freeze();
          return;
        }

        /** @var self value[v] */
        ArrayUtils.each(value, function(v, k) {
          value[k].freeze();
        });
      }
    }.bind(this));

    return this;
  }

  /**
   * Returns true if the message has been frozen. A frozen message is
   * immutable and cannot be modified.
   *
   * @return bool
   */
  isFrozen() {
    return this.isFrozen;
  }

  /**
   * Returns true if the data of the message matches.
   *
   * @param Message other
   *
   * @return bool
   */
  equals(other) {
    return JSON.stringify(this) === JSON.stringify(other);
  }

  /**
   * Returns true if this message is being replayed. Providing a value
   * will set the flag but this can only be done once. Note that
   * setting a message as being "replayed" will also freeze the message.
   *
   * @param bool|null replay
   *
   * @return bool
   *
   * @throws LogicException
   */
  isReplay(replay = null) {
    if (null === replay) {
      if (null === this.isReplay) {
        this.isReplay = false;
      }
      return this.isReplay;
    }

    if (null === this.isReplay) {
      this.isReplay = Boolean(replay);
      if (this.isReplay) {
        this.freeze();
      }
      return this.isReplay;
    }

    throw new LogicException('You can only set the replay mode on one time.');
  }

  /**
   * Populates the defaults on all fields or just the fieldName provided.
   * Operation will NOT overwrite any fields already set.
   *
   * @param string|null fieldName
   *
   * @return static
   */
  populateDefaults(fieldName = null) {
    guardFrozenMessage.bind(this)();

    if (fieldName) {
      populateDefault.bind(this)(this.constructor.schema().getField(fieldName));

      return this;
    }

    ArrayUtils.each(this.constructor.schema().getFields(), function(field) {
      populateDefault.bind(this)(field);
    }.bind(this));

    return this;
  }

  /**
   * Returns true if the field has been populated.
   *
   * @param string fieldName
   *
   * @return bool
   */
  has(fieldName) {
    if (undefined === this.data[fieldName]) {
      return false;
    }

    if (Array.isArray(this.data[fieldName])) {
      return this.data[fieldName] && this.data[fieldName].length;
    }

    return true;
  }

  /**
   * Returns the value for the given field. If the field has not
   * been set you will get a null value.
   *
   * @param string fieldName
   * @param mixed  defaultValue
   *
   * @return mixed
   */
  get(fieldName, defaultValue = null) {
    if (!this.has(fieldName)) {
      return defaultValue;
    }

    let field = this.constructor.schema().getField(fieldName);
    if (field.isASet()) {
      return Object.keys(this.data[fieldName]).map(function(v) {
        return this.data[fieldName][v];
      });
    }

    return this.data[fieldName];
  }

  /**
   * Clears the value of a field.
   *
   * @param string fieldName
   *
   * @return static
   *
   * @throws GdbotsPbjException
   * @throws RequiredFieldNotSet
   */
  clear(fieldName) {
    guardFrozenMessage.bind(this)();

    let field = this.constructor.schema().getField(fieldName);

    delete this.data[fieldName];

    this.clearedFields[fieldName] = true;

    populateDefault.bind(this)(field);

    return this;
  }

  /**
   * Returns true if the field has been cleared.
   *
   * @param string fieldName
   *
   * @return bool
   */
  hasClearedField(fieldName) {
    return undefined !== this.clearedFields[fieldName];
  }

  /**
   * Returns an array of field names that have been cleared.
   *
   * @return array
   */
  getClearedFields() {
    return Object.keys(this.clearedFields);
  }

  /**
   * @deprecated Use "set" instead, the method signature is the same.
   *
   * @param string fieldName
   * @param mixed value
   *
   * @return static
   *
   * @throws GdbotsPbjException
   */
  setSingleValue(fieldName, value) {
    return this.set(fieldName, value);
  }

  /**
   * Sets a single value field.
   *
   * @param string fieldName
   * @param mixed  value
   *
   * @return static
   *
   * @throws GdbotsPbjException
   */
  set(fieldName, value) {
    guardFrozenMessage.bind(this)();

    let field = this.constructor.schema().getField(fieldName);
    if (!field.isASingleValue()) {
      throw new Error('Field [' + fieldName + '] must be a single value.');
    }

    if (null === value) {
        return this.clear(fieldName);
    }

    field.guardValue(value);

    this.data[fieldName] = value;

    delete this.clearedFields[fieldName];

    return this;
  }

  /**
   * Returns true if the provided value is in the set of values.
   *
   * @param string fieldName
   * @param mixed  value
   *
   * @return bool
   */
  isInSet(fieldName, value) {
    if (!this.data[fieldName] || this.data[fieldName].length === 0 || !Array.isArray(this.data[fieldName])) {
      return false;
    }

    if ((/boolean|number|string/).test(typeof value) || ('object' === typeof value && undefined !== value.prototype.toString)) {
      key = value.trim();
    } else {
      return false;
    }

    if (0 === key.length) {
      return false;
    }

    return undefined !== this.data[fieldName][key.toLowerCase()];
  }

  /**
   * Adds an array of unique values to an unsorted set of values.
   *
   * @param string fieldName
   * @param array values
   *
   * @return static
   *
   * @throws GdbotsPbjException
   */
  addToSet(fieldName, values) {
    guardFrozenMessage.bind(this)();

    let field = this.constructor.schema().getField(fieldName);
    if (!field.isASet()) {
      throw new Error('Field [' + fieldName + '] must be a set.');
    }

    ArrayUtils.each(values, function(value) {
      if (0 === value.length) {
        return;
      }

      field.guardValue(value);

      key = value.trim().toLowerCase();

      this.data[fieldName][key] = value;
    }.bind(this));

    if (this.data[fieldName] && this.data[fieldName].length) {
      delete this.clearedFields[fieldName];
    }

    return this;
  }

  /**
   * Removes an array of values from a set.
   *
   * @param string fieldName
   * @param array  values
   *
   * @return static
   *
   * @throws GdbotsPbjException
   */
  removeFromSet(fieldName, values) {
    guardFrozenMessage.bind(this)();

    let field = this.constructor.schema().getField(fieldName);
    if (!field.isASet()) {
      throw new Error('Field [' + fieldName + '] must be a set.');
    }

    ArrayUtils.each(values, function(value) {
      if (0 === value.length) {
        return;
      }

      let key = value.trim().toLowerCase();

      this.data[fieldName][key] = value;
    }.bind(this));

    if (!this.data[fieldName] || this.data[fieldName].length === 0) {
      this.clearedFields[fieldName] = true
    }

    return this;
  }

  /**
   * Returns true if the provided value is in the list of values.
   * This is a NOT a strict comparison, it uses "==".
   * @link http://php.net/manual/en/function.in-array.php
   *
   * @param string fieldName
   * @param mixed  value
   *
   * @return bool
   */
  isInList(fieldName, value) {
    if (!this.data[fieldName] || this.data[fieldName].length === 0 || !Array.isArray(this.data[fieldName])) {
        return false;
      }

      return -1 !== this.data[fieldName].indexOf(value);
  }

  /**
   * Returns an item in a list or null if it doesn't exist.
   *
   * @param string fieldName
   * @param int    index
   * @param mixed  defaultValue
   *
   * @return mixed
   */
  getFromListAt(fieldName, index, defaultValue = null) {
    index = parseInt(index);

    if (!this.data[fieldName]
      || this.data[fieldName].length === 0
      || !Array.isArray(this.data[fieldName])
      || undefined === this.data[fieldName][index]
    ) {
      return defaultValue;
    }

    return this.data[fieldName][index];
  }

  /**
   * Adds an array of values to an unsorted list/array (not unique).
   *
   * @param string fieldName
   * @param array  values
   *
   * @return static
   *
   * @throws GdbotsPbjException
   */
  addToList(fieldName, values) {
    guardFrozenMessage.bind(this)();

    let field = this.constructor.schema().getField(fieldName);
    if (!field.isAList()) {
      throw new Error('Field [' + fieldName + '] must be a list.');
    }

    ArrayUtils.each(values, function(value) {
      field.guardValue(value);

      this.data[fieldName].push(value);
    }.bind(this));

    delete this.clearedFields[fieldName];

    return this;
  }

  /**
   * Removes the element from the array at the index.
   *
   * @param string fieldName
   * @param int    index
   *
   * @return static
   *
   * @throws GdbotsPbjException
   */
  removeFromListAt(fieldName, index) {
    guardFrozenMessage.bind(this)();

    let field = this.constructor.schema().getField(fieldName);
    if (!field.isAList()) {
      throw new Error('Field [' + fieldName + '] must be a list.');
    }

    index = parseInt(index);

    if (!this.data[fieldName] || this.data[fieldName].length === 0) {
      return this;
    }

    if (undefined !== this.data[fieldName][index]) {
      delete this.data[fieldName][index];
    }

    if (!this.data[fieldName] || this.data[fieldName].length === 0) {
      this.clearedFields[fieldName] = true;

      return this;
    }

    this.data[fieldName] = Object.keys(this.data[fieldName]).map(function(v) {
      return this.data[fieldName][v];
    });

    return this;
  }

  /**
   * Returns true if the map contains the provided key.
   *
   * @param string fieldName
   * @param string key
   *
   * @return bool
   */
  isInMap(fieldName, key) {
    if (!this.data[fieldName] || this.data[fieldName].length === 0 || !Array.isArray(this.data[fieldName]) || 'string' !== typeof key) {
      return false;
    }

    return undefined !== this.data[fieldName][key];
  }

  /**
   * Returns the value of a key in a map or null if it doesn't exist.
   *
   * @param string fieldName
   * @param string key
   * @param mixed  defaultValue
   *
   * @return mixed
   */
  getFromMap(fieldName, key, defaultValue = null) {
    if (!this.isInMap(fieldName, key)) {
      return defaultValue;
    }

    return this.data[fieldName][key];
  }

  /**
   * Adds a key/value pair to a map.
   *
   * @param string fieldName
   * @param string key
   * @param mixed value
   *
   * @return static
   *
   * @throws GdbotsPbjException
   */
  addToMap(fieldName, key, value) {
    guardFrozenMessage.bind(this)();

    let field = this.constructor.schema().getField(fieldName);
    if (!field.isAMap()) {
      throw new Error('Field [' + fieldName + '] must be a map.');
    }

    if (null === value) {
      return this.removeFromMap(fieldName, key);
    }

    field.guardValue(value);

    this.data[fieldName][key] = value;

    delete this.clearedFields[fieldName];

    return this;
  }

  /**
   * Removes a key/value pair from a map.
   *
   * @param string fieldName
   * @param string key
   *
   * @return static
   *
   * @throws GdbotsPbjException
   */
  removeFromMap(fieldName, key) {
    guardFrozenMessage.bind(this)();

    let field = this.constructor.schema().getField(fieldName);
    if (!field.isAMap()) {
      throw new Error('Field [' + fieldName + '] must be a map.');
    }

    delete this.data[fieldName][key];

    if (!this.data[fieldName] || this.data[fieldName].length === 0) {
        this.clearedFields[fieldName] = true;
    }

    return this;
  }
}

/**
 * Recursively unfreezes this object and any of its children.
 * Used internally during the clone process.
 */
function unFreeze() {
  this.isFrozen = false;
  this.isReplay = null;

  ArrayUtils.each(this.constructor.schema().getFields(), function(field) {
    if (field.getType().isMessage()) {
      /** @var self value */
      let value = this.get(field.getName());
      if (!value || value.length === 0) {
        return;
      }

      if (value instanceof Message) {
        unFreeze.bind(value)();
        return;
      }

      /** @var self value[v] */
      ArrayUtils.each(value, function(v, k) {
        unFreeze.bind(value[k])();
      });
    }
  }.bind(this));
}

/**
 * Ensures a frozen message can't be modified.
 *
 * @throws FrozenMessageIsImmutable
 */
function guardFrozenMessage() {
  if (this.isFrozen) {
    throw new FrozenMessageIsImmutable(this);
  }
}

/**
 * Populates the default on a single field if it's not already set
 * and the default generated is not a null value or empty array.
 *
 * @param Field field
 *
 * @return bool Returns true if a non null/empty default was applied or already present.
 */
function populateDefault(field) {
  if (this.has(field.getName())) {
    return true;
  }

  let defaultValue = field.getDefault(this);
  if (null === defaultValue) {
    return false;
  }

  if (field.isASingleValue()) {
    this.data[field.getName()] = defaultValue;

    delete this.clearedFields[field.getName()];

    return true;
  }

  if (!defaultValue || defaultValue.length === 0) {
    return false;
  }

  /*
   * sets have a special handling to deal with unique values
   */
  if (field.isASet()) {
    this.addToSet(field.getName(), defaultValue);

    return true;
  }

  this.data[field.getName()] = defaultValue;

  delete this.clearedFields[field.getName()];

  return true;
}
