'use strict';

import AbstractStringType from 'gdbots/pbj/type/abstract-string-type';

export default class MediumTextType extends AbstractStringType
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
