'use strict';

import Microtime from 'gdbots/common/microtime';
import Type from 'gdbots/pbj/type/type';

export default class MicrotimeType extends Type
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!(value instanceof Microtime)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "Microtime" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if (value instanceof Microtime) {
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

    if (value instanceof Microtime) {
      return value;
    }

    return Microtime.fromString(value);
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
    return Microtime.create();
  }

  /**
   * {@inheritdoc}
   */
  isNumeric() {
    return true;
  }
}
