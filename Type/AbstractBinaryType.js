/* eslint-disable class-methods-use-this, no-unused-vars */

import base64 from 'base-64';
import clamp from 'lodash-es/clamp';
import isString from 'lodash-es/isString';
import trim from 'lodash-es/trim';
import utf8 from 'utf8';
import Type from './Type';
import AssertionFailed from '../Exception/AssertionFailed';
import DecodeValueFailed from '../Exception/DecodeValueFailed';

let useDecodeFromBase64 = true;
let useEncodeToBase64 = true;

export default class AbstractBinaryType extends Type {
  /**
   * @param {boolean} [useBase64]
   */
  decodeFromBase64(useBase64 = true) {
    useDecodeFromBase64 = useBase64;
  }

  /**
   * @param {boolean} [useBase64]
   */
  encodeToBase64(useBase64 = true) {
    useEncodeToBase64 = useBase64;
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!isString(value)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] is not a string.`);
    }

    // fixme: deal with browsers not having "Buffer" available
    // we must get BYTES, not characters ಠ_ಠ
    const strLength = Buffer.from(useEncodeToBase64 ? this.encode(value, field) : value).byteLength;
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
    if (trimmed === '') {
      return null;
    }

    return useEncodeToBase64 ? base64.encode(utf8.encode(trimmed)) : trimmed;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?string}
   *
   * @throws {DecodeValueFailed}
   */
  decode(value, field, codec = null) {
    const trimmed = trim(value);
    if (trimmed === '') {
      return null;
    }

    if (!useDecodeFromBase64) {
      return trimmed;
    }

    try {
      return utf8.decode(base64.decode(trimmed));
    } catch (e) {
      throw new DecodeValueFailed(value, field, `${e.name}::${e.message}`);
    }
  }

  /**
   * @returns {boolean}
   */
  isBinary() {
    return true;
  }

  /**
   * @returns {boolean}
   */
  isString() {
    return true;
  }
}