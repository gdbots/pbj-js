/* eslint-disable class-methods-use-this, no-unused-vars */

import clamp from 'lodash/clamp';
import isSafeInteger from 'lodash/isSafeInteger';
import toSafeInteger from 'lodash/toSafeInteger';
import Type from './Type';
import AssertionFailed from '../exceptions/AssertionFailed';

export default class AbstractIntType extends Type {
  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!isSafeInteger(value)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] is not an integer.`);
    }

    const min = clamp(field.getMin(), this.getMin(), this.getMax());
    const max = clamp(field.getMax(), this.getMin(), this.getMax());

    if (value < min || value > max) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Number "${value}" was expected to be at least "${min}" and at most "${max}".`);
    }
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {number}
   */
  encode(value, field, codec = null) {
    return toSafeInteger(value);
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
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
}
