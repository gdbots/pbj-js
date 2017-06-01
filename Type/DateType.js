/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../Enum/TypeName';
import AssertionFailed from '../Exception/AssertionFailed';
import DecodeValueFailed from '../Exception/DecodeValueFailed';

/** @type DateType */
let instance = null;

export default class DateType extends Type {
  constructor() {
    super(TypeName.DATE);
  }

  /**
   * @returns {DateType}
   */
  static create() {
    if (instance === null) {
      instance = new DateType();
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
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${JSON.stringify(value)}" was expected to be a Date.`);
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
      return value.toISOString().substr(0, 10);
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

    let date;
    if (value instanceof Date) {
      // ensures no time component and utc
      date = value.toISOString().substr(0, 10);
    } else {
      date = value.substr(0, 10);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new DecodeValueFailed(value, field, `Field [${field.getName()}] :: Value "${value}" is not a valid date with format "YYYY-MM-DD".`);
    }

    try {
      const [year, month, day] = date.split('-').map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    } catch (e) {
      throw new DecodeValueFailed(value, field, e.message);
    }
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