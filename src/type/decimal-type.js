'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import Type from 'gdbots/pbj/type/type';

export default class DecimalType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (+value === value && (!isFinite(value) || !!(value % 1))) {
      throw new Error('Value "' + value + '" is not a float.')
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    return parseFloat(bcadd(parseFloat(value), '0', field.getScale()));
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    return parseFloat(bcadd(parseFloat(value), '0', field.getScale()));
  }

  /**
   * {@inheritdoc}
   */
  getDefault() {
    return 0.0;
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
    return -1;
  }

  /**
   * {@inheritdoc}
   */
  getMax() {
    return Infinity;
  }
}

/**
 * Add two arbitrary precision numbers
 *
 * @param string leftOperand  The left operand, as a string.
 * @param string rightOperand The right operand, as a string.
 * @param int    scale        This optional parameter is used to set the number of
 *                            digits after the decimal place in the result. If omitted,
 *                            it will default to the scale set globally with the bcscale()
 *                            function, or fallback to 0 if this has not been set.
 *
 * @return string
 */
function bcadd(leftOperand, rightOperand, scale) {
  throw new Error('Not yet implemented.');
}
