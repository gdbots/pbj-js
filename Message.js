/* eslint-disable */
import SchemaNotDefined from './Exception/SchemaNotDefined';
import Schema from './Schema';

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
   * Populates the defaults on all fields or just the fieldName provided.
   * Operation will NOT overwrite any fields already set.
   *
   * @param {?string} fieldName
   *
   * @returns {Message}
   */
  populateDefaults(fieldName = null) {
    //this.guardFrozenMessage();
    return this;
  }
}