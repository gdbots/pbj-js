'use strict';

import AbstractIntType from 'gdbots/pbj/type/abstract-int-type';

export default class SignedIntType extends AbstractIntType
{
  /**
   * {@inheritdoc}
   */
  getMin() {
    return -2147483648;
  }

  /**
   * {@inheritdoc}
   */
  getMax() {
    return 2147483647;
  }
}
