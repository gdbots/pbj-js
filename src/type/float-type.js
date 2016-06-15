'use strict';

import Type from 'gdbots/pbj/type/type';

export default class FloatType extends Type
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (+value === value && (!isFinite(value) || !!(value % 1))) {
      throw new Exception('Value "' + value + '" is not a float.')
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    return parseFloat(value);
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    return parseFloat(value);
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
