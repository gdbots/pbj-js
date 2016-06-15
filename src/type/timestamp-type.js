'use strict';

import DateUtils from 'gdbots/common/util/date-utils';
import Type from 'gdbots/pbj/type/type';

export default class TimestampType extends Type
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
  encode(value, field) {
    return parseInt(value);
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    return parseInt(value);
  }

  /**
   * {@inheritdoc}
   */
  getDefault() {
    return new Date().timeStamp();
  }

  /**
   * {@inheritdoc}
   */
  isNumeric() {
    return true;
  }
}
