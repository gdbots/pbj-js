'use strict';

import Enum from 'gdbots/common/enum';
import Type from 'gdbots/pbj/type/type';
import DecodeValueFailed from 'gdbots/pbj/exception/decode-value-failed';

export default class StringEnumType extends Type
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!(value instanceof Enum)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "Enum" but is not.');
    }

    if (field.hasClassName() && !(value instanceof field.hasClassName())) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "' + field.hasClassName() + '" but is not.');
    }

    if ('string' !== typeof value.getValue()) {
      throw new Exception('Value "' + value.getValue() + '" expected to be string.')
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
    if (value instanceof Enum) {
      return parseInt(value.getValue());
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

    /** @var Enum className */
    className = field.getClassName();

    try {
      return eval(className + '.initEnum([value])');
    } catch (e) {
      throw new DecodeValueFailed(value, field, e);
    }
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
