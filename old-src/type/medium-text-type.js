'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import AbstractStringType from 'gdbots/pbj/type/abstract-string-type';

export default class MediumTextType extends SystemUtils.mixinClass(AbstractStringType)
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
