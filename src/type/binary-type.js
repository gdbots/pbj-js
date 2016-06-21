'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import AbstractBinaryType from 'gdbots/pbj/type/abstract-binary-type';

export default class BinaryType extends SystemUtils.mixinClass(AbstractBinaryType)
{
  /**
   * {@inheritdoc}
   */
  getMaxBytes() {
    return 255;
  }
}
