/* eslint-disable class-methods-use-this, no-unused-vars */

import isFinite from 'lodash-es/isFinite';
import toFinite from 'lodash-es/toFinite';
import Type from './Type';
import TypeName from '../Enum/TypeName';
import AssertionFailed from '../Exception/AssertionFailed';

/** @type DecimalType */
let instance = null;

// fixme: handle precision
export default class DecimalType extends Type {
  constructor() {
    super(TypeName.DECIMAL);
  }

  /**
   * @returns {DecimalType}
   */
  static create() {
    if (instance === null) {
      instance = new DecimalType();
    }

    return instance;
  }

  /**
   * @param {*} value
   * @param {Field} field
   */
  guard(value, field) {
    if (!isFinite(value)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${JSON.stringify(value)}" is not a decimal.`);
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
    return toFinite(value).toFixed(field.getScale());
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
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