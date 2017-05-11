'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import AbstractBinaryType from 'gdbots/pbj/type/abstract-binary-type';

export default class BlobType extends SystemUtils.mixinClass(AbstractBinaryType)
{
  /**
   * {@inheritdoc}
   */
  allowedInSet() {
    return false;
  }
}
