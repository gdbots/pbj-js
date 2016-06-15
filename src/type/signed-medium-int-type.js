'use strict';

import AbstractIntType from 'gdbots/pbj/type/abstract-int-type';

export default class SignedMediumIntType extends AbstractIntType
{
  /**
   * {@inheritdoc}
   */
  getMin() {
    return -8388608;
  }

  /**
   * {@inheritdoc}
   */
  getMax() {
    return 8388607;
  }
}
