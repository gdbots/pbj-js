'use strict';

import AbstractBinaryType from 'gdbots/pbj/type/abstract-binary-type';

export default class BlobType extends AbstractBinaryType
{
  /**
   * {@inheritdoc}
   */
  allowedInSet() {
    return false;
  }
}
