/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../Enum/TypeName';
import BigNumber from '../WellKnown/BigNumber';
import AssertionFailed from '../Exception/AssertionFailed';

/** @type BigIntType */
let instance = null;

export default class BigIntType extends Type {
  constructor() {
    super(TypeName.BIG_INT);
  }

  /**
   * @returns {BigIntType}
   */
  static create() {
    if (instance === null) {
      instance = new BigIntType();
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
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${JSON.stringify(value)}" was expected to be a BigNumber.`);
    }

    if (value.isNegative()) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" cannot be negative.`);
    }

    if (!value.lessThanOrEqualTo('18446744073709551615')) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" cannot be greater than [18446744073709551615].`);
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