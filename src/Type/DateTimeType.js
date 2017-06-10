/* eslint-disable class-methods-use-this, no-unused-vars */

import moment from 'moment';
import isValidISO8601Date from '@gdbots/common/isValidISO8601Date';
import Type from './Type';
import TypeName from '../Enum/TypeName';
import AssertionFailed from '../Exception/AssertionFailed';
import DecodeValueFailed from '../Exception/DecodeValueFailed';

/** @type DateTimeType */
let instance = null;

export default class DateTimeType extends Type {
  constructor() {
    super(TypeName.DATE_TIME);
  }

  /**
   * @returns {DateTimeType}
   */
  static create() {
    if (instance === null) {
      instance = new DateTimeType();
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
    if (!(value instanceof Date)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] was expected to be a Date.`);
    }
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?string}
   */
  encode(value, field, codec = null) {
    if (value instanceof Date) {
      return value.toISOString();
    }

    return null;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?Date}
   */
  decode(value, field, codec = null) {
    if (value === null) {
      return null;
    }

    if (!(value instanceof Date) && !isValidISO8601Date(value)) {
      throw new AssertionFailed(
        `Field [${field.getName()}] :: Value "${value}" is not a valid ISO8601 date/time.  E.g. "2017-05-25T02:54:18Z".`,
      );
    }

    const m = moment(value);
    if (m.isValid()) {
      return m.utc().toDate();
    }

    throw new DecodeValueFailed(value, field, `Field [${field.getName()}] :: Value "${value}" is not a valid IS8601 date.`);
  }

  /**
   * @returns {boolean}
   */
  isScalar() {
    return false;
  }

  /**
   * @returns {boolean}
   */
  isString() {
    return true;
  }

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return false;
  }
}
