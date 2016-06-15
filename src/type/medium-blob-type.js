'use strict';

import AbstractBinaryType from 'gdbots/pbj/type/abstract-binary-type';

export default class MediumBlobType extends AbstractBinaryType
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
