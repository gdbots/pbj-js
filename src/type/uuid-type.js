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
    if (!value.hasTrait('UuidIdentifier')) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "UuidIdentifier" but is not.');
    }

    if (field.hasClassName() && !value.hasTrait(field.getClassName())) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "' + field.getClassName() + '" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if (value.hasTrait('UuidIdentifier')) {
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

    /** @var UuidIdentifier className */
    let className = field.getClassName() || 'UuidIdentifier';
    if (value.hasTrait(className)) {
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
    return UuidIdentifier.generate();
  }

  /**
   * {@inheritdoc}
   */
  isString() {
    return true;
  }
}
