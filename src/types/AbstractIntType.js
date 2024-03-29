import clamp from 'lodash-es/clamp.js';
import isSafeInteger from 'lodash-es/isSafeInteger.js';
import toSafeInteger from 'lodash-es/toSafeInteger.js';
import Type from './Type.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';

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
