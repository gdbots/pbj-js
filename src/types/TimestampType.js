/* eslint-disable class-methods-use-this, no-unused-vars */

import isSafeInteger from 'lodash/isSafeInteger';
import toSafeInteger from 'lodash/toSafeInteger';
import isValidTimestamp from '@gdbots/common/isValidTimestamp';
import Type from './Type';
import TypeName from '../enums/TypeName';
import AssertionFailed from '../exceptions/AssertionFailed';

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
    return Math.floor(Date.now() / 1000);
  }

  /**
   * @returns {boolean}
   */
  isNumeric() {
    return true;
  }
}
