'use strict';

import NumberUtils from 'gdbots/common/util/number-utils';
import UrlUtils from 'gdbots/common/util/url-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import Type from 'gdbots/pbj/type/type';
import DecodeValueFailed from 'gdbots/pbj/exception/decode-value-failed';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class AbstractBinaryType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  constructor(typeName) {
    super(typeName);

    privateProps.set(this, {
      /** @var bool */
      decodeFromBase64: true,

      /** @var bool */
      encodeToBase64: true
    });
  }

  /**
   * @param bool useBase64
   */
  decodeFromBase64(useBase64) {
    privateProps.get(this).decodeFromBase64 = Boolean(useBase64);
  }

  /**
   * @param bool useBase64
   */
  encodeToBase64(useBase64) {
    privateProps.get(this).encodeToBase64 = Boolean(useBase64);
  }

  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if ('string' !== typeof value) {
      throw new Error('Value must be a string.');
    }

    // intentionally using strlen to get byte length, not mb_strlen
    let length = privateProps.get(this).encodeToBase64 ? this.encode(value, field).length : value.length;
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

    return privateProps.get(this).encodeToBase64 ? UrlUtils.base64Encode(value) : value;
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    value = value.trim();

    if (value === '') {
      return null;
    }

    if (!privateProps.get(this).decodeFromBase64) {
      return value;
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
