/* eslint-disable no-unused-vars */
import isArray from 'lodash-es/isArray';
import isPlainObject from 'lodash-es/isPlainObject';
import AssertionFailed from '../Exception/AssertionFailed';
import InvalidResolvedSchema from '../Exception/InvalidResolvedSchema';
import DynamicField from '../WellKnown/DynamicField';
import GeoPoint from '../WellKnown/GeoPoint';
import MessageRef from '../MessageRef';
import MessageResolver from '../MessageResolver';
import { PBJ_FIELD_NAME } from '../Schema';
import SchemaId from '../SchemaId';

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
    const includeAllFields = opt.includeAllFields || false;

    schema.getFields().forEach(field => {
      const fieldName = field.getName();
      if (!message.has(fieldName)) {
        if (includeAllFields || message.hasClearedField(fieldName)) {
          payload[fieldName] = null;
        }

        return;
      }

      const value = message.get(fieldName);
      const type = field.getType();

      if (field.isASingleValue()) {
        payload[fieldName] = type.encode(value, field, this);
        return;
      }

      if (field.isAMap()) {
        payload[fieldName] = {};
        // eslint-disable-next-line no-return-assign
        Object.keys(value).forEach(k => payload[fieldName][k] = type.encode(value[k], field, this));
        return;
      }

      payload[fieldName] = [];
      value.forEach(v => payload[fieldName].push(type.encode(v, field, this)));
    });

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
  static deserialize(obj, options = {}) {
    opt = options;
    if (!obj[PBJ_FIELD_NAME]) {
      throw new AssertionFailed(`Object provided must contain the [${PBJ_FIELD_NAME}] key.`);
    }

    const schemaId = SchemaId.fromString(obj[PBJ_FIELD_NAME]);
    const message = new (MessageResolver.resolveId(schemaId))();
    const schema = message.schema();

    if (schema.getCurieMajor() !== schemaId.getCurieMajor()) {
      throw new InvalidResolvedSchema(schema, schemaId);
    }

    Object.keys(obj).forEach(fieldName => {
      if (!schema.hasField(fieldName)) {
        return;
      }

      const value = obj[fieldName];
      if (value === null) {
        message.clear(fieldName);
        return;
      }

      const field = schema.getField(fieldName);
      const type = field.getType();

      if (field.isASingleValue()) {
        message.set(fieldName, type.decode(value, field, this));
        return;
      }

      if (field.isASet() || field.isAList()) {
        if (!isArray(value)) {
          throw new AssertionFailed(`Field [${fieldName}] must be an array.`);
        }

        const values = [];
        value.forEach(v => values.push(type.decode(v, field, this)));

        if (field.isASet()) {
          message.addToSet(fieldName, values);
        } else {
          message.addToList(fieldName, values);
        }

        return;
      }

      if (!isPlainObject(value)) {
        throw new AssertionFailed(`Field [${fieldName}] must be an object.`);
      }

      Object.keys(value).forEach(k => {
        message.addToMap(fieldName, k, type.decode(value[k], field, this));
      });
    });

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
  static decodeMessage(value, field) {
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