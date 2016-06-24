'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import TimeUuidIdentifier from 'gdbots/identifiers/time-uuid-identifier';
import Type from 'gdbots/pbj/type/type';

export default class TimeUuidType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!value.hasTrait('TimeUuidIdentifier') && 'TimeUuidIdentifier' !== SystemUtils.getClass(value)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "TimeUuidIdentifier" but is not.');
    }

    if (field.hasInstance() && field.getInstance().name !== SystemUtils.getClass(value)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "' + field.getInstance().name + '" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if (value.hasTrait('TimeUuidIdentifier') || 'TimeUuidIdentifier' === SystemUtils.getClass(value)) {
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

    /** @var TimeUuidIdentifier instance */
    let instance = field.getInstance() || TimeUuidIdentifier;
    if (value.hasTrait(instance.name) || instance.name === SystemUtils.getClass(value)) {
      return value;
    }

    return instance.fromString(value);
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
