'use strict';

import DateUtils from 'gdbots/common/util/date-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import Type from 'gdbots/pbj/type/type';

export default class TimestampType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if ('number' !== typeof value) {
      throw new Error('Value must be a number.');
    }

    if (!DateUtils.isValidTimestamp(value)) {
      throw new Error('Field [' + field.getName() + '] value [' + value + '] is not a valid unix timestamp.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field, codec = null) {
    return parseInt(value);
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field, codec = null) {
    return parseInt(value);
  }

  /**
   * {@inheritdoc}
   */
  getDefault() {
    return new Date().getTime();
  }

  /**
   * {@inheritdoc}
   */
  isNumeric() {
    return true;
  }
}
