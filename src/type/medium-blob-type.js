'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import AbstractBinaryType from 'gdbots/pbj/type/abstract-binary-type';

export default class MediumBlobType extends SystemUtils.mixinClass(AbstractBinaryType)
{
  /**
   * {@inheritdoc}
   */
  getMaxBytes() {
    return 16777215;
  }

  /**
   * {@inheritdoc}
   */
  allowedInSet() {
    return false;
  }
}
