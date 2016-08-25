'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import Type from 'gdbots/pbj/type/type';

export default class DateType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!(value instanceof Date)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "Date" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field, codec = null) {
    if (value instanceof Date) {
      return value.toISOString().slice(0,10);
    }

    return null;
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field, codec = null) {
    if (!value || value.length === 0) {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    return new Date();
  }

  /**
   * {@inheritdoc}
   */
  isScalar() {
    return false;
  }

  /**
   * {@inheritdoc}
   */
  isString() {
    return true;
  }

  /**
   * {@inheritdoc}
   */
  allowedInSet() {
    return false;
  }
}
