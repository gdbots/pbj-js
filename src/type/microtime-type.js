'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import Microtime from 'gdbots/common/microtime';
import Type from 'gdbots/pbj/type/type';

export default class MicrotimeType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if ('Microtime' !== SystemUtils.getClass(value)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "Microtime" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if ('Microtime' === SystemUtils.getClass(value)) {
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

    if ('Microtime' === SystemUtils.getClass(value)) {
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
