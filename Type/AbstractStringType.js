/* eslint-disable class-methods-use-this, no-unused-vars, comma-dangle */

import clamp from 'lodash-es/clamp';
import isString from 'lodash-es/isString';
import trim from 'lodash-es/trim';
import Type from './Type';
import AssertionFailed from '../Exception/AssertionFailed';

export default class AbstractStringType extends Type {
  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!isString(value)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${JSON.stringify(value)}" is not a string.`);
    }

    // fixme: deal with browsers not having "Buffer" available
    // we must get BYTES, not characters ಠ_ಠ
    const strLength = Buffer.from(value).byteLength;
    const minLength = field.getMinLength();
    const maxLength = clamp(field.getMaxLength(), minLength, this.getMaxBytes());

    if (strLength >= minLength && strLength <= maxLength) {
      return;
    }

    throw new AssertionFailed(`Field [${field.getName()}] :: Must be between [${minLength}] and [${maxLength}] bytes, [${strLength}] bytes given.`);
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