'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import AbstractStringType from 'gdbots/pbj/type/abstract-string-type';

export default class TextType extends SystemUtils.mixinClass(AbstractStringType)
{
  /**
   * {@inheritdoc}
   */
  allowedInSet() {
    return false;
  }
}
