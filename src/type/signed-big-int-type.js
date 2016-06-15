'use strict';

import BigNumber from 'gdbots/common/big-number';
import Type from 'gdbots/pbj/type/type';

export default class SignedBigIntType extends Type
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!(value instanceof BigNumber)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "BigNumber" but is not.');
    }

    if (!value.isGreaterThanOrEqualTo('-9223372036854775808')) {
      throw new Error('Field [' + field.getName() + '] cannot be less than [-9223372036854775808].');
    }

    if (!value.isLessThanOrEqualTo('9223372036854775807')) {
      throw new Error('Field [' + field.getName() + '] cannot be greater than [9223372036854775807].');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if (value instanceof BigNumber) {
      return value.getValue();
    }

    return '0';
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    if (null === value || value instanceof BigNumber) {
      return value;
    }

    return new BigNumber(value);
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
  getDefault() {
    return new BigNumber(0);
  }

  /**
   * {@inheritdoc}
   */
  isNumeric() {
    return true;
  }
}
