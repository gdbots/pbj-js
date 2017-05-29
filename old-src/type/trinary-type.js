'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import AbstractIntType from 'gdbots/pbj/type/abstract-int-type';

/**
 * @link https://en.wikipedia.org/wiki/Three-valued_logic
 * 0 = unknown
 * 1 = true
 * 2 = false
 */
export default class TrinaryType extends SystemUtils.mixinClass(AbstractIntType)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if ([0, 1, 2].indexOf(value) === -1) {
      throw new Error('Field [' + field.getName() + '] value [' + value + '] is not a valid. Must be 0, 1, or 2.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field, codec = null) {
    let tmp = parseInt(value);
    return isNaN(tmp) || !isFinite(tmp) ? 0 : tmp;
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field, codec = null) {
    let tmp = parseInt(value);
    return isNaN(tmp) || !isFinite(tmp) ? 0 : tmp;
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

  /**
   * {@inheritdoc}
   */
  getMin() {
    return 0;
  }

  /**
   * {@inheritdoc}
   */
  getMax() {
    return 2;
  }

  /**
   * {@inheritdoc}
   */
  allowedInSet() {
    return false;
  }
}
