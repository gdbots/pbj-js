import Type from './Type.js';
import TypeName from '../enums/TypeName.js';
import Microtime from '../well-known/Microtime.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';
import DecodeValueFailed from '../exceptions/DecodeValueFailed.js';

export default class MicrotimeType extends Type {
  constructor() {
    super(TypeName.MICROTIME);
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!(value instanceof Microtime)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] was expected to be a Microtime.`);
    }
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {?string}
   */
  encode(value, field, codec = null) {
    if (value instanceof Microtime) {
      return value.toString();
    }

    return null;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {?Microtime}
   */
  decode(value, field, codec = null) {
    if (value === null || value instanceof Microtime) {
      return value;
    }

    try {
      return Microtime.fromString(`${value}`);
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
   * @returns {Microtime}
   */
  getDefault() {
    return Microtime.create();
  }

  /**
   * @returns {boolean}
   */
  isNumeric() {
    return true;
  }
}
