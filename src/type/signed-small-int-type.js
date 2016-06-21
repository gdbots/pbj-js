'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import AbstractIntType from 'gdbots/pbj/type/abstract-int-type';

export default class SignedSmallIntType extends SystemUtils.mixinClass(AbstractIntType)
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
