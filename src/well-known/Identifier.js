import isString from 'lodash-es/isString.js';
import trim from 'lodash-es/trim.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';

export default class Identifier {
  /**
   * @param {string} value
   *
   * @throws {AssertionFailed}
   */
  constructor(value) {
    if (!isString(value)) {
      throw new AssertionFailed(`${this.constructor.name}'s value must be a string.`);
    }

    const trimmed = trim(value);
    if (trimmed === '') {
      throw new AssertionFailed(`${this.constructor.name}'s value cannot be empty.`);
    }

    Object.defineProperty(this, 'value', { value: trimmed });
  }

  /**
   * @param {string} value
   *
   * @returns {Identifier}
   */
  static fromString(value) {
    return new this(value);
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.value;
  }

  /**
   * @returns {string}
   */
  toJSON() {
    return this.value;
  }

  /**
   * @returns {string}
   */
  valueOf() {
    return this.value;
  }

  /**
   * @param {Identifier} other
   *
   * @returns {boolean}
   */
  equals(other) {
    return this.value === other.value;
  }
}
