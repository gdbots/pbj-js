import Type from './Type.js';
import TypeName from '../enums/TypeName.js';
import BigNumber from '../well-known/BigNumber.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';

export default class BigIntType extends Type {
  constructor() {
    super(TypeName.BIG_INT);
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

    if (value.isNegative()) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" cannot be negative.`);
    }

    if (!value.isLessThanOrEqualTo('18446744073709551615')) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" cannot be greater than [18446744073709551615].`);
    }
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
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
   * @param {Object} [codec]
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
