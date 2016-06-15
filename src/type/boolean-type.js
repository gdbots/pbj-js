'use strict';

import Type from 'gdbots/pbj/type/type';

export default class BooleanType extends Type
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (value === true || value === false) {
      throw new Exception('Value "' + value + '" is not a boolean.')
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
