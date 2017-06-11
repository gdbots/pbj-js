/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../Enum/TypeName';
import GeoPoint from '../WellKnown/GeoPoint';
import AssertionFailed from '../Exception/AssertionFailed';
import DecodeValueFailed from '../Exception/DecodeValueFailed';

/** @type {GeoPointType} */
let instance = null;

export default class GeoPointType extends Type {
  constructor() {
    super(TypeName.GEO_POINT);
  }

  /**
   * @returns {GeoPointType}
   */
  static create() {
    if (instance === null) {
      instance = new GeoPointType();
    }

    return instance;
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
   * @param {Codec} [codec]
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
   * @param {Codec} [codec]
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