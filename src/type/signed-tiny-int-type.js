'use strict';

import AbstractIntType from 'gdbots/pbj/type/abstract-int-type';

export default class SignedTinyIntType extends AbstractIntType
{
  /**
   * {@inheritdoc}
   */
  getMin() {
    return -128;
  }

  /**
   * {@inheritdoc}
   */
  getMax() {
    return 127;
  }
}
