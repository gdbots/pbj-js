'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import BigNumber from 'gdbots/pbj/well-known/big-number';
import Type from 'gdbots/pbj/type/type';

export default class SignedBigIntType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if ('BigNumber' !== SystemUtils.getClass(value)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "BigNumber" but is not.');
    }

    if (!value.greaterThanOrEqualTo('-9223372036854775808')) {
      throw new Error('Field [' + field.getName() + '] cannot be less than [-9223372036854775808].');
    }

    if (!value.lessThanOrEqualTo('9223372036854775807')) {
      throw new Error('Field [' + field.getName() + '] cannot be greater than [9223372036854775807].');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field, codec = null) {
    if ('BigNumber' === SystemUtils.getClass(value)) {
      return value.toString();
    }

    return '0';
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field, codec = null) {
    if (null === value || 'BigNumber' === SystemUtils.getClass(value)) {
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
