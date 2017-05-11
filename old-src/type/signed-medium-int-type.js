'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import AbstractIntType from 'gdbots/pbj/type/abstract-int-type';

export default class SignedMediumIntType extends SystemUtils.mixinClass(AbstractIntType)
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
