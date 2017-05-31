/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../Enum/TypeName';
import Microtime from '../WellKnown/Microtime';
import AssertionFailed from '../Exception/AssertionFailed';
import DecodeValueFailed from '../Exception/DecodeValueFailed';

/** @type MicrotimeType */
let instance = null;

export default class MicrotimeType extends Type {
  constructor() {
    super(TypeName.MICROTIME);
  }

  /**
   * @returns {MicrotimeType}
   */
  static create() {
    if (instance === null) {
      instance = new MicrotimeType();
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
    if (!(value instanceof Microtime)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${JSON.stringify(value)}" was expected to be a Microtime.`);
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