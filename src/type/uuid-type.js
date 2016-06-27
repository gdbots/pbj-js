'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import UuidIdentifier from 'gdbots/identifiers/uuid-identifier';
import Type from 'gdbots/pbj/type/type';

export default class UuidType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!value.hasTrait('UuidIdentifier') && 'UuidIdentifier' !== SystemUtils.getClass(value)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "UuidIdentifier" but is not.');
    }

    if (field.hasInstance()
      && !(
        field.getInstance().name === SystemUtils.getClass(value)
        || value.hasTrait(field.getInstance().name)
      )
    ) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "' + field.getInstance().name + '" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if (value.hasTrait('UuidIdentifier') || 'UuidIdentifier' === SystemUtils.getClass(value)) {
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

    /** @var UuidIdentifier instance */
    let instance = field.getInstance() || UuidIdentifier;
    if ('object' === typeof value
      && (
        value.hasTrait(instance.name)
        || instance.name === SystemUtils.getClass(value)
      )
    ) {
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
    return UuidIdentifier.generate();
  }

  /**
   * {@inheritdoc}
   */
  isString() {
    return true;
  }
}
