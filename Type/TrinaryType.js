/* eslint-disable class-methods-use-this, no-unused-vars */

import isSafeInteger from 'lodash-es/isSafeInteger';
import toSafeInteger from 'lodash-es/toSafeInteger';
import Type from './Type';
import TypeName from '../Enum/TypeName';
import AssertionFailed from '../Exception/AssertionFailed';

/** @type TrinaryType */
let instance = null;

/**
 * @link https://en.wikipedia.org/wiki/Three-valued_logic
 * 0 = unknown
 * 1 = true
 * 2 = false
 */
export default class TrinaryType extends Type {
  constructor() {
    super(TypeName.TRINARY);
  }

  /**
   * @returns {TrinaryType}
   */
  static create() {
    if (instance === null) {
      instance = new TrinaryType();
    }

    return instance;
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