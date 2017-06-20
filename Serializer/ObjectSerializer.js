/* eslint-disable no-unused-vars */
import DynamicField from '../WellKnown/DynamicField';
import GeoPoint from '../WellKnown/GeoPoint';
import MessageRef from '../MessageRef';

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
  static deserialize(obj, options = {}) {}

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