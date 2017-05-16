/* eslint-disable class-methods-use-this, no-unused-vars */

import clamp from 'lodash-es/clamp';
import isSafeInteger from 'lodash-es/isSafeInteger';
import toSafeInteger from 'lodash-es/toSafeInteger';
import Type from './Type';
import AssertionFailed from '../Exception/AssertionFailed';

export default class AbstractIntType extends Type {
  /**
   * @param {*} value
   * @param {Field} field
   */
  guard(value, field) {
    if (!isSafeInteger(value)) {
      throw new AssertionFailed(`${field.getName()} :: Value "${JSON.stringify(value)}" is not an integer.`);
    }

    const min = clamp(field.getMin(), this.getMin(), this.getMax());
    const max = clamp(field.getMax(), this.getMin(), this.getMax());

    if (value < min || value > max) {
      throw new AssertionFailed(`${field.getName()} :: Number "${value}" was expected to be at least "${min}" and at most "${max}".`);
    }
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @return {number}
   */
  encode(value, field, codec = null) {
    return toSafeInteger(value) || 0;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @return {number}
   */
  decode(value, field, codec = null) {
    return toSafeInteger(value) || 0;
  }

  /**
   * @return {number}
   */
  getDefault() {
    return 0;
  }

  /**
   * @return {boolean}
   */
  isNumeric() {
    return true;
  }
}