'use strict';

import DateUtils from 'gdbots/common/util/date-utils.js';
import StringUtils from 'gdbots/common/util/string-utils.js';
import InvalidArgumentException from 'gdbots/pbj/exception/invalid-argument-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

/**
 * Value object for microtime with methods to convert to and from integers.
 *
 * @link http://php.net/manual/en/function.microtime.php
 */
export default class Microtime
{
  /**
   * Private constructor to ensure static methods are used.
   */
  constructor() {

    privateProps.set(this, {
      /**
       * The microtime is stored as a 16 digit integer.
       *
       * @var int
       */
      int: 0,

      /** @var int */
      sec: 0,

      /** @var int */
      usec: 0
    });
  }

  /**
   * Create a new object using the current microtime.
   *
   * @return self
   */
  static create() {
    return this.fromTimeOfDay(DateUtils.gettimeofday());
  }

  /**
   * Create a new object from a float value, typically one that is returned
   * from the microtime(true) call.
   *
   * @link http://php.net/manual/en/function.microtime.php
   *
   * @param float float e.g. 1422060753.9581
   *
   * @return self
   */
  static fromFloat(float) {
    let str = StringUtils.strPad(float.replace('.', ''), 16, '0').substring(0, 16);
    let m = new this();
    privateProps.get(m).int = parseInt(str);
    privateProps.get(m).sec = parseInt(str.substring(0, 10));
    privateProps.get(m).usec = parseInt(str.slice(-6));
    return m;
  }

  /**
   * Create a new object from the result of a gettimeofday call that
   * is NOT returned as a float.
   *
   * @link http://php.net/manual/en/function.gettimeofday.php
   *
   * @param array tod
   *
   * @return self
   */
  static fromTimeOfDay(tod) {
    let str = tod.sec + StringUtils.strPad(tod.usec, 6, '0', 'STR_PAD_LEFT');
    let m = new this();
    privateProps.get(m).int = parseInt(str);
    privateProps.get(m).sec = parseInt(str.substring(0, 10));
    privateProps.get(m).usec = parseInt(str.slice(-6));
    return m;
  }

  /**
   * Create a new object from the integer (or string) version of the microtime.
   *
   * Total digits would be unix timestamp (10) + (3-6) microtime digits.
   * Lack of precision on digits will be automatically padded with zeroes.
   *
   * @param string|int stringOrInteger
   *
   * @return self
   *
   * @throws \InvalidArgumentException
   */
  static fromString(stringOrInteger) {
    let int = String(stringOrInteger);
    let len = String(int).length;
    if (len < 13 || len > 16) {
      throw new InvalidArgumentException('Input [' + int + '] must be between 13 and 16 digits, [' + len + '] given.');
    }

    if (len < 16) {
      int = StringUtils.strPad(int, 16, '0');
    }

    let m = new this();
    privateProps.get(m).int = parseInt(int);
    privateProps.get(m).sec = parseInt(int.substring(0, 10));
    privateProps.get(m).usec = parseInt(int.slice(-6));
    return m;
  }

  /**
   * @return string
   */
  toString() {
    return String(privateProps.get(this).int);
  }

  /**
   * @return int
   */
  getSeconds() {
    return privateProps.get(this).sec;
  }

  /**
   * @return int
   */
  getMicroSeconds() {
    return privateProps.get(this).usec;
  }

  /**
   * @return Date
   */
  toDateTime() {
    let d = new Date();
    d.setTime(parseFloat(privateProps.get(this).sec + '.' + StringUtils.strPad(privateProps.get(this).usec, 6, '0', 'STR_PAD_LEFT')) * 1000);
    return d;
  }

  /**
   * @return float
   */
  toFloat() {
    return parseFloat(privateProps.get(this).sec + '.' + StringUtils.strPad(privateProps.get(this).usec, 6, '0', 'STR_PAD_LEFT'));
  }
}
