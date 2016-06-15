'use strict';

import AbstractBinaryType from 'gdbots/pbj/type/abstract-binary-type';

export default class BinaryType extends AbstractBinaryType
{
  /**
   * {@inheritdoc}
   */
  getMaxBytes() {
    return 255;
  }
}
