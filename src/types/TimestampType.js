import isSafeInteger from 'lodash-es/isSafeInteger.js';
import toSafeInteger from 'lodash-es/toSafeInteger.js';
import isValidTimestamp from '../utils/isValidTimestamp.js';
import Type from './Type.js';
import TypeName from '../enums/TypeName.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';

export default class TimestampType extends Type {
  constructor() {
    super(TypeName.TIMESTAMP);
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!isSafeInteger(value) || !isValidTimestamp(value)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] is not a valid unix timestamp.`);
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
    return Math.floor(Date.now() / 1000);
  }

  /**
   * @returns {boolean}
   */
  isNumeric() {
    return true;
  }
}
