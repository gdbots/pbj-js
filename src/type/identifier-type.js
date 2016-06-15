'use strict';

import Identifier from 'gdbots/identifiers/identifier';
import Type from 'gdbots/pbj/type/type';
import DecodeValueFailed from 'gdbots/pbj/exception/decode-value-failed';

export default class IdentifierType extends Type
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!(value instanceof Identifier)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "Identifier" but is not.');
    }

    if (field.hasClassName() && !(value instanceof field.hasClassName())) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "' + field.hasClassName() + '" but is not.');
    }

    // intentionally using strlen to get byte length, not mb_strlen
    let length = value.toString().length;
    let maxBytes = this.getMaxBytes();
    let okay = length > 0 && length <= maxBytes;

    if (!okay) {
      throw new Error('Field [' + field.getName() + '] must be between [1] and [' + maxBytes + '] bytes, [' + length + '] bytes given.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if (value instanceof Identifier) {
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

    /** @var Identifier className */
    className = field.getClassName();

    try {
      return eval(className + '.fromString(value)');
    } catch (e) {
      throw new DecodeValueFailed(value, field, e);
    }
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
  getMaxBytes() {
    return 100;
  }
}
