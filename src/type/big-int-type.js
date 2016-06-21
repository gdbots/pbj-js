'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import BigNumber from 'gdbots/common/big-number';
import Type from 'gdbots/pbj/type/type';

export default class BigIntType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!value.hasTrait('BigNumber')) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "BigNumber" but is not.');
    }

    if (value.isNegative()) {
      throw new Error('Field [' + field.getName() + '] cannot be negative.');
    }

    if (!value.isLessThanOrEqualTo('18446744073709551615')) {
      throw new Error('Field [' + field.getName() + '] cannot be greater than [18446744073709551615].');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if (value.hasTrait('BigNumber')) {
      return value.getValue();
    }

    return '0';
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    if (null === value || value.hasTrait('BigNumber')) {
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
