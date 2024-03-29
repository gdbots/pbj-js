import Type from './Type.js';
import TypeName from '../enums/TypeName.js';
import GeoPoint from '../well-known/GeoPoint.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';
import DecodeValueFailed from '../exceptions/DecodeValueFailed.js';

export default class GeoPointType extends Type {
  constructor() {
    super(TypeName.GEO_POINT);
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!(value instanceof GeoPoint)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] was expected to be a GeoPoint.`);
    }
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {*}
   */
  encode(value, field, codec = null) {
    if (value instanceof GeoPoint) {
      return codec.encodeGeoPoint(value, field);
    }

    return null;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {?GeoPoint}
   */
  decode(value, field, codec = null) {
    if (value === null || value instanceof GeoPoint) {
      return value;
    }

    try {
      return codec.decodeGeoPoint(value, field);
    } catch (e) {
      throw new DecodeValueFailed(value, field, e.message);
    }
  }

  /**
   * @returns {boolean}
   */
  isScalar() {
    return false;
  }

  /**
   * @returns {boolean}
   */
  encodesToScalar() {
    return false;
  }

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return false;
  }
}
