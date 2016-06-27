'use strict';

import ArrayUtils from 'gdbots/common/util/array-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import Type from 'gdbots/pbj/type/type';
import DecodeValueFailed from 'gdbots/pbj/exception/decode-value-failed';

export default class StringEnumType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!value.hasTrait('Enum')) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "Enum" but is not.');
    }

    if (field.hasInstance()
      && !(
        field.getInstance().name === SystemUtils.getClass(value)
        || value.hasTrait(field.getInstance().name)
      )
    ) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "' + field.getInstance().name + '" but is not.');
    }

    if ('string' !== typeof value.getValue()) {
      throw new Error('Value "' + value.getValue() + '" expected to be string.')
    }

    // intentionally using strlen to get byte length, not mb_strlen
    let length = value.toString().length;
    let maxBytes = this.getMaxBytes();
    let okay = length > 0 && length <= maxBytes;

    if (!okay) {
      throw new Error('Field [' + field.getName() + '] must be between [1] and [' + maxBytes + '] bytes, [' + length + '] bytes given.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if (value.hasTrait('Enum')) {
      return String(value.getValue());
    }

    return null;
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    if (null === value) {
      return null;
    }

    /** @var Enum instance */
    let instance = field.getInstance();
    let enumValue = null;

    ArrayUtils.each(instance.enumValues, function(item) {
      if (value === String(item.getValue())) {
        enumValue = item;
      }
    });

    if (null === enumValue) {
      throw new DecodeValueFailed(value, field, e);
    }

    return enumValue;
  }

  /**
   * {@inheritdoc}
   */
  isScalar() {
    return false;
  }

  /**
   * {@inheritdoc}
   */
  isString() {
    return true;
  }

  /**
   * {@inheritdoc}
   */
  getMaxBytes() {
    return 100;
  }
}
