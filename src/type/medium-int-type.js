'use strict';

import AbstractIntType from 'gdbots/pbj/type/abstract-int-type';

export default class MediumIntType extends AbstractIntType
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
    return 16777215;
  }
}
