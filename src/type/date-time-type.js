'use strict';

import DateUtils from 'gdbots/common/util/date-utils';
import Type from 'gdbots/pbj/type/type';

export default class DateTimeType extends Type
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
  encode(value, field) {
    if (value instanceof Date) {
      return value.toISOString(); //same format as ISO8601_ZULU
    }

    return null;
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
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
