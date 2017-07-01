import isString from 'lodash/isString';
import moment from 'moment';
import padEnd from 'lodash/padEnd';
import AssertionFailed from '../exceptions/AssertionFailed';

/**
 * Value object for microtime with methods to convert to and from integers.
 * Note that this is a unix timestamp __WITH__ microseconds but stored
 * as an integer NOT a float.
 *
 * In the PHP lib we have 10 digits (unix timestamp) concatenated with
 * 6 microsecond digits (from php's microtime function we get that value).
 * In JavaScript we don't get microsecond precision, we get milliseconds.
 * fixme: generate microseconds precision to match php.
 *
 * @link http://php.net/manual/en/function.microtime.php
 * @link https://github.com/gdbots/pbj-php/blob/master/src/well-known/Microtime.php
 */
export default class Microtime {
  /**
   * @param {string} value
   *
   * @throws {AssertionFailed}
   */
  constructor(value) {
    if (!isString(value)) {
      throw new AssertionFailed('Microtime value must be a string.');
    }

    if (!/^[0-9]{16}$/.test(value)) {
      throw new AssertionFailed('Microtime must be 16 digits.');
    }

    Object.defineProperty(this, 'value', { value });
    Object.freeze(this);
  }

  /**
   * @returns {Microtime}
   */
  static create() {
    return Microtime.fromMoment(moment());
  }

  /**
   * @param {Date} date
   *
   * @returns {Microtime}
   */
  static fromDate(date) {
    return Microtime.fromMoment(moment(date));
  }

  /**
   * @param {string} value
   *
   * @returns {Microtime}
   */
  static fromString(value) {
    return new Microtime(value);
  }

  /**
   * @private
   *
   * @param {moment.Moment} m
   *
   * @returns {Microtime}
   */
  static fromMoment(m) {
    return new Microtime(`${padEnd(m.valueOf(), 16, '0')}`);
  }

  /**
   * @returns {number}
   */
  toNumber() {
    return +`${this.value.substr(0, 10)}.${this.value.substr(10)}`;
  }

  /**
   * @private
   *
   * @returns {moment.Moment}
   */
  toMoment() {
    return moment.unix(this.toNumber());
  }

  /**
   * @returns {Date}
   */
  toDate() {
    return this.toMoment().toDate();
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.value;
  }

  /**
   * @returns {string}
   */
  toJSON() {
    return this.value;
  }

  /**
   * @returns {string}
   */
  valueOf() {
    return this.value;
  }

  /**
   * @param {Microtime} other
   *
   * @returns {boolean}
   */
  equals(other) {
    return this.value === other.value;
  }
}
