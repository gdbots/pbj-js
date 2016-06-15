'use strict';

import NumberUtils from 'gdbots/common/util/number-utils';
import Type from 'gdbots/pbj/type/type';

export default class AbstractIntType extends Type
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if ('number' !== typeof value) {
      throw new Error('Value must be a number.');
    }

    let min = NumberUtils.bound(field.getMin(), this.getMin(), this.getMax());
    let max = NumberUtils.bound(field.getMax(), this.getMin(), this.getMax());
    let okay = value >= min && value <= max;

    if (!okay) {
      throw new Error('Field [' + field.getName() + '] value must be between [' + min + '] and [' + max + '], [' + value + '] given.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    return parseInt(value);
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    return parseInt(value);
  }

  /**
   * {@inheritdoc}
   */
  getDefault() {
    return 0;
  }

  /**
   * {@inheritdoc}
   */
  isNumeric() {
    return true;
  }
}
