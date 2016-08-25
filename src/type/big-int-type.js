'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import BigNumber from 'gdbots/pbj/well-known/big-number';
import Type from 'gdbots/pbj/type/type';

export default class BigIntType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if ('BigNumber' !== SystemUtils.getClass(value)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "BigNumber" but is not.');
    }

    if (value.isNegative()) {
      throw new Error('Field [' + field.getName() + '] cannot be negative.');
    }

    if (!value.lessThanOrEqualTo('18446744073709551615')) {
      throw new Error('Field [' + field.getName() + '] cannot be greater than [18446744073709551615].');
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
