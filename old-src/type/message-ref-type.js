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
    if ('MessageRef' !== SystemUtils.getClass(value)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "MessageRef" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field, codec = null) {
    return codec.encodeMessageRef(value, field);
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field, codec = null) {
    return codec.decodeMessageRef(value, field);
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
