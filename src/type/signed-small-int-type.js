'use strict';

import AbstractIntType from 'gdbots/pbj/type/abstract-int-type';

export default class SignedSmallIntType extends AbstractIntType
{
  /**
   * {@inheritdoc}
   */
  getMin() {
    return -32768;
  }

  /**
   * {@inheritdoc}
   */
  getMax() {
    return 32767;
  }
}
