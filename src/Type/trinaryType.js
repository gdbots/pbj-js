/* eslint-disable class-methods-use-this, no-unused-vars */

import isSafeInteger from 'lodash/isSafeInteger';
import toSafeInteger from 'lodash/toSafeInteger';
import Type from './Type';
import TypeName from '../Enum/TypeName';
import AssertionFailed from '../Exception/AssertionFailed';

/**
 * @link https://en.wikipedia.org/wiki/Three-valued_logic
 * 0 = unknown
 * 1 = true
 * 2 = false
 */
class TrinaryType extends Type {
  constructor() {
    super(TypeName.TRINARY);
  }

  /**
   * @param {*} value
   * @param {Field} field
   */
  guard(value, field) {
    if (!isSafeInteger(value)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${JSON.stringify(value)}" is not an integer.`);
    }

    if ([0, 1, 2].indexOf(value) === -1) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" is not an element of the valid values: [0, 1, 2]`);
    }
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {number}
   */
  encode(value, field, codec = null) {
    return toSafeInteger(value);
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {number}
   */
  decode(value, field, codec = null) {
    return toSafeInteger(value);
  }

  /**
   * @returns {number}
   */
  getDefault() {
    return 0;
  }

  /**
   * @returns {boolean}
   */
  isNumeric() {
    return true;
  }

  /**
   * @returns {number}
   */
  getMin() {
    return 0;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 2;
  }

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return false;
  }
}

const instance = new TrinaryType();
export default instance;
