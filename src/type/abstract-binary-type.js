'use strict';

import NumberUtils from 'gdbots/common/util/number-utils';
import UrlUtils from 'gdbots/common/util/url-utils';
import Type from 'gdbots/pbj/type/type';
import DecodeValueFailed from 'gdbots/pbj/exception/decode-value-failed';

export default class AbstractBinaryType extends Type
{
  /**
   * {@inheritdoc}
   */
  constructor(typeName) {
    super(typeName);

    /** @var bool */
    this.decodeFromBase64 = true;

    /** @var bool */
    this.encodeToBase64 = true;
  }

  /**
   * @param bool useBase64
   */
  decodeFromBase64(useBase64) {
    this.decodeFromBase64 = Boolean(useBase64);
  }

  /**
   * @param bool useBase64
   */
  encodeToBase64(useBase64) {
    this.encodeToBase64 = Boolean(useBase64);
  }

  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if ('string' !== typeof value) {
      throw new Error('Value must be a string.');
    }

    // intentionally using strlen to get byte length, not mb_strlen
    let length = this.encodeToBase64 ? this.encode(value, field).length : value.length;
    let minLength = field.getMinLength();
    let maxLength = NumberUtils.bound(field.getMaxLength(), minLength, this.getMaxBytes());
    let okay = length >= minLength && length <= maxLength;

    if (!okay) {
      throw new Error('Field [' + field.getName() + '] must be between [' + minLength + '] and [' + maxLength + '] bytes, [' + length + '] bytes given.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    value = value.trim();

    if (value === '') {
      return null;
    }

    return this.encodeToBase64 ? UrlUtils.base64Encode(value) : value;
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    value = value.trim();

    if (value === '') {
      return null;
    }

    if (!this.decodeFromBase64) {
      return $value;
    }

    value = UrlUtils.base64Decode(value);
    if (false === value) {
      throw new DecodeValueFailed(value, field, 'Strict base64_decode failed.');
    }

    return value;
  }

  /**
   * {@inheritdoc}
   */
  isBinary() {
    return true;
  }

  /**
   * {@inheritdoc}
   */
  isString() {
    return true;
  }
}
