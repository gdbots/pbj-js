import isArray from 'lodash-es/isArray.js';
import isPlainObject from 'lodash-es/isPlainObject.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';
import InvalidResolvedSchema from '../exceptions/InvalidResolvedSchema.js';
import DynamicField from '../well-known/DynamicField.js';
import GeoPoint from '../well-known/GeoPoint.js';
import MessageRef from '../well-known/MessageRef.js';
import MessageResolver from '../MessageResolver.js';
import { PBJ_FIELD_NAME } from '../Schema.js';
import SchemaId from '../SchemaId.js';

let opt = {};

export default class ObjectSerializer {
  /**
   * @param {Message} message
   * @param {Object}  options
   *
   * @returns {Object}
   *
   * @throws {GdbotsPbjException}
   */
  static serialize(message, options = {}) {
    opt = options;
    const schema = message.schema();
    message.validate();
    const payload = {};

    for (const field of schema.getFields()) {
      const fieldName = field.getName();
      if (!message.has(fieldName)) {
        continue;
      }

      const value = message.get(fieldName);
      const type = field.getType();

      if (field.isASingleValue()) {
        payload[fieldName] = type.encode(value, field, this);
        continue;
      }

      if (field.isAMap()) {
        payload[fieldName] = {};
        for (const k of Object.keys(value)) {
          payload[fieldName][k] = type.encode(value[k], field, this);
        }
        continue;
      }

      payload[fieldName] = value.map(v => type.encode(v, field, this));
    }

    return payload;
  }

  /**
   * @param {Object} obj
   * @param {Object} options
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  static async deserialize(obj, options = {}) {
    opt = options;
    const schemaId = SchemaId.fromString(obj[PBJ_FIELD_NAME]);
    const message = new (await MessageResolver.resolveId(schemaId));
    const schema = message.schema();

    if (schema.getCurieMajor() !== schemaId.getCurieMajor()) {
      throw new InvalidResolvedSchema(schema, schemaId);
    }

    for (const fieldName of Object.keys(obj)) {
      if (!schema.hasField(fieldName)) {
        continue;
      }

      const value = obj[fieldName];
      if (value === null) {
        message.clear(fieldName);
        continue;
      }

      const field = schema.getField(fieldName);
      const type = field.getType();

      if (field.isASingleValue()) {
        message.set(fieldName, await type.decode(value, field, this));
        continue;
      }

      if (field.isASet() || field.isAList()) {
        if (!isArray(value)) {
          throw new AssertionFailed(`Field [${fieldName}] must be an array.`);
        }

        const values = [];
        for (const v of value) {
          values.push(await type.decode(v, field, this));
        }

        if (field.isASet()) {
          message.addToSet(fieldName, values);
        } else {
          message.addToList(fieldName, values);
        }

        continue;
      }

      if (!isPlainObject(value)) {
        throw new AssertionFailed(`Field [${fieldName}] must be an object.`);
      }

      for (const k of Object.keys(value)) {
        message.addToMap(fieldName, k, await type.decode(value[k], field, this));
      }
    }

    return message.set(PBJ_FIELD_NAME, schema.getId().toString()).populateDefaults();
  }

  /**
   * @param {Message} message
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeMessage(message, field) {
    return this.serialize(message, opt);
  }

  /**
   * @param {Object} value
   * @param {Field} field
   *
   * @returns {Message}
   */
  static async decodeMessage(value, field) {
    return this.deserialize(value, opt);
  }

  /**
   * @param {MessageRef} messageRef
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeMessageRef(messageRef, field) {
    return messageRef.toObject();
  }

  /**
   * @param {Object} value
   * @param {Field} field
   *
   * @returns {MessageRef}
   */
  static decodeMessageRef(value, field) {
    return MessageRef.fromObject(value);
  }

  /**
   * @param {GeoPoint} geoPoint
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeGeoPoint(geoPoint, field) {
    return geoPoint.toObject();
  }

  /**
   * @param {Object} value
   * @param {Field} field
   *
   * @returns {GeoPoint}
   */
  static decodeGeoPoint(value, field) {
    return GeoPoint.fromObject(value);
  }

  /**
   * @param {DynamicField} dynamicField
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeDynamicField(dynamicField, field) {
    return dynamicField.toObject();
  }

  /**
   * @param {Object} value
   * @param {Field} field
   *
   * @returns {DynamicField}
   */
  static decodeDynamicField(value, field) {
    return DynamicField.fromObject(value);
  }
}
