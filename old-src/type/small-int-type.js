'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import AbstractIntType from 'gdbots/pbj/type/abstract-int-type';

export default class SmallIntType extends SystemUtils.mixinClass(AbstractIntType)
{
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
    return 65535;
  }
}
