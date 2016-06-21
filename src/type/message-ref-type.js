'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import EncodeValueFailed from 'gdbots/pbj/exception/encode-value-failed';
import DecodeValueFailed from 'gdbots/pbj/exception/decode-value-failed';
import Type from 'gdbots/pbj/type/type';

export default class MessageRefType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!value.hasTrait('MessageRef')) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "MessageRef" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    throw new EncodeValueFailed(value, field, 'MessageRef must be encoded with a Serializer.');
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    throw new DecodeValueFailed(value, field, 'MessageRef must be decoded with a Serializer.');
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
}
