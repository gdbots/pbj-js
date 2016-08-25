'use strict';

import NumberUtils from 'gdbots/common/util/number-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import Type from 'gdbots/pbj/type/type';

export default class AbstractStringType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if ('string' !== typeof value) {
      throw new Error('Value must be a string.');
    }

    // intentionally using strlen to get byte length, not mb_strlen
    let length = value.length;
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
  encode(value, field, codec = null) {
    value = value.trim();

    if (value === '') {
      return null;
    }

    return value;
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field, codec = null) {
    value = value.trim();

    if (value === '') {
      return null;
    }

    return value;
  }

  /**
   * {@inheritdoc}
   */
  isString() {
    return true;
  }
}
