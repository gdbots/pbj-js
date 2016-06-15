'use strict';

import UuidIdentifier from 'gdbots/identifiers/uuid-identifier';
import Type from 'gdbots/pbj/type/type';

export default class UuidType extends Type
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!(value instanceof UuidIdentifier)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "UuidIdentifier" but is not.');
    }

    if (field.hasClassName() && !(value instanceof field.hasClassName())) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "' + field.hasClassName() + '" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if (value instanceof UuidIdentifier) {
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
    return UuidIdentifier.generate();
  }

  /**
   * {@inheritdoc}
   */
  isString() {
    return true;
  }
}
