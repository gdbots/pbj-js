import isValidISO8601Date from '../utils/isValidISO8601Date.js';
import Type from './Type.js';
import TypeName from '../enums/TypeName.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';
import DecodeValueFailed from '../exceptions/DecodeValueFailed.js';

export default class DateTimeType extends Type {
  constructor() {
    super(TypeName.DATE_TIME);
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
   * @param {Object} [codec]
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
   * @param {Object} [codec]
   *
   * @returns {?Date}
   */
  decode(value, field, codec = null) {
    if (value === null || value instanceof Date) {
      return value;
    }

    if (!(value instanceof Date) && !isValidISO8601Date(value)) {
      throw new AssertionFailed(
        `Field [${field.getName()}] :: Value "${value}" is not a valid ISO8601 date/time.  E.g. "2017-05-25T02:54:18Z".`,
      );
    }

    const d = new Date(value);
    if (d instanceof Date) {
      return d;
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
