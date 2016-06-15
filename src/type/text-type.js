'use strict';

import AbstractStringType from 'gdbots/pbj/type/abstract-string-type';

export default class TextType extends AbstractStringType
{
  /**
   * {@inheritdoc}
   */
  allowedInSet() {
    return false;
  }
}
