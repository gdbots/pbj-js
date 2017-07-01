/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../enums/TypeName';
import Microtime from '../well-known/Microtime';
import AssertionFailed from '../exceptions/AssertionFailed';
import DecodeValueFailed from '../exceptions/DecodeValueFailed';

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
   * @param {Codec} [codec]
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
   * @param {Codec} [codec]
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