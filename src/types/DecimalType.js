import isFinite from 'lodash/isFinite';
import toFinite from 'lodash/toFinite';
import Type from './Type';
import TypeName from '../enums/TypeName';
import AssertionFailed from '../exceptions/AssertionFailed';

// fixme: handle precision
export default class DecimalType extends Type {
  constructor() {
    super(TypeName.DECIMAL);
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!isFinite(value)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] is not a decimal.`);
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
    return toFinite(value).toFixed(field.getScale());
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {number}
   */
  decode(value, field, codec = null) {
    return toFinite(toFinite(value).toFixed(field.getScale()));
  }

  /**
   * @returns {number}
   */
  getDefault() {
    return 0.0;
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
    return Number.MIN_VALUE;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return Number.MAX_VALUE;
  }
}
