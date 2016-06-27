'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import Type from 'gdbots/pbj/type/type';

export default class BooleanType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (value !== true && value !== false) {
      throw new Error('Value "' + value + '" is not a boolean.')
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    return Boolean(value);
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    return Boolean(value);
  }

  /**
   * {@inheritdoc}
   */
  getDefault() {
    return false;
  }

  /**
   * @see Type::isBoolean
   */
  isBoolean() {
    return true;
  }

  /**
   * {@inheritdoc}
   */
  allowedInSet() {
    return false;
  }
}
