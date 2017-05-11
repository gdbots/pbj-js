'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import Type from 'gdbots/pbj/type/type';

export default class DynamicFieldType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if ('DynamicField' !== SystemUtils.getClass(value)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "DynamicField" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field, codec = null) {
    return codec.encodeDynamicField(value, field);
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field, codec = null) {
    return codec.decodeDynamicField(value, field);
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
  encodesToScalar() {
    return false;
  }

  /**
   * {@inheritdoc}
   */
  allowedInSet() {
    return false;
  }
}
