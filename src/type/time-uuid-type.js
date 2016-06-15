'use strict';

import TimeUuidIdentifier from 'gdbots/identifiers/time-uuid-identifier';
import Type from 'gdbots/pbj/type/type';

export default class TimeUuidType extends Type
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!(value instanceof TimeUuidIdentifier)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "TimeUuidIdentifier" but is not.');
    }

    if (field.hasClassName() && !(value instanceof field.hasClassName())) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "' + field.hasClassName() + '" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if (value instanceof TimeUuidIdentifier) {
      return value.toString();
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

    /** @var TimeUuidIdentifier className */
    let className = field.getClassName() || 'TimeUuidIdentifier';
    if (value instanceof className) {
      return value;
    }

    return eval(className + '.fromString(value)');
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
  getDefault() {
    return TimeUuidIdentifier.generate();
  }

  /**
   * {@inheritdoc}
   */
  isString() {
    return true;
  }
}
