/* eslint-disable class-methods-use-this, no-unused-vars, comma-dangle */

import clamp from 'lodash/clamp';
import isString from 'lodash/isString';
import trim from 'lodash/trim';
import Type from './Type';
import AssertionFailed from '../Exception/AssertionFailed';

export default class AbstractStringType extends Type {
  /**
   * @param {*} value
   * @param {Field} field
   */
  guard(value, field) {
    if (!isString(value)) {
      throw new AssertionFailed(`${field.getName()} :: Value "${JSON.stringify(value)}" is not a string.`);
    }

    const strlen = encodeURIComponent(value).split(/%..|./).length - 1;
    const minLength = field.getMinLength();
    const maxLength = clamp(field.getMaxLength(), minLength, this.getMaxBytes());

    if (strlen >= minLength && strlen <= maxLength) {
      return;
    }

    throw new AssertionFailed(
      `${field.getName()} :: Must be between [${minLength}] and [${maxLength}] bytes, [${strlen}] bytes given.`
    );
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?string}
   */
  encode(value, field, codec = null) {
    const trimmed = trim(value);
    return trimmed === '' ? null : trimmed;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?string}
   */
  decode(value, field, codec = null) {
    const trimmed = trim(value);
    return trimmed === '' ? null : trimmed;
  }

  /**
   * @returns {boolean}
   */
  isString() {
    return true;
  }
}
