/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../Enum/TypeName';
import BigNumber from '../WellKnown/BigNumber';
import AssertionFailed from '../Exception/AssertionFailed';

/** @type {SignedBigIntType} */
let instance = null;

export default class SignedBigIntType extends Type {
  constructor() {
    super(TypeName.SIGNED_BIG_INT);
  }

  /**
   * @returns {SignedBigIntType}
   */
  static create() {
    if (instance === null) {
      instance = new SignedBigIntType();
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
    if (!(value instanceof BigNumber)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] was expected to be a BigNumber.`);
    }

    if (!value.greaterThanOrEqualTo('-9223372036854775808')) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" cannot be less than [-9223372036854775808].`);
    }

    if (!value.lessThanOrEqualTo('9223372036854775807')) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" cannot be greater than [9223372036854775807].`);
    }
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {string}
   */
  encode(value, field, codec = null) {
    if (value instanceof BigNumber) {
      return `${value.toFixed(0)}`;
    }

    return '0';
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?BigNumber}
   */
  decode(value, field, codec = null) {
    if (value === null || value instanceof BigNumber) {
      return value;
    }

    return new BigNumber(value);
  }

  /**
   * @returns {boolean}
   */
  isScalar() {
    return false;
  }

  /**
   * @returns {BigNumber}
   */
  getDefault() {
    return new BigNumber(0);
  }

  /**
   * @returns {boolean}
   */
  isNumeric() {
    return true;
  }
}
