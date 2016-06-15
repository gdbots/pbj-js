'use strict';

import ArrayUtils from 'gdbots/common/util/array-utils';
import EncodeValueFailed from 'gdbots/pbj/exception/encode-value-failed';
import DecodeValueFailed from 'gdbots/pbj/exception/decode-value-failed';
import Type from 'gdbots/pbj/type/type';
import Message from 'gdbots/pbj/message';

export default class MessageType extends Type
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!(value instanceof MessageRef)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "MessageRef" but is not.');
    }

    if (field.hasClassName() && !(value instanceof field.hasClassName())) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "' + field.hasClassName() + '" but is not.');
    }

    if (!field.hasAnyOfClassNames()) {
      return;
    }

    let classNames = field.getAnyOfClassNames();
    if (!classNames || classNames.length === 0) {
      // means it can be "any message"
      return;
    }

    let found = false;
    ArrayUtils.each(classNames, function(className) {
      if (value instanceof className) {
        found = true;
      }
    });

    if (!found) {
      throw new Error('Field [' + field.getName() + '] must be an instance of at least one of: ' + classNames.join(',') + '.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    throw new EncodeValueFailed(value, field, 'Message must be encoded with a Serializer.');
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    throw new DecodeValueFailed(value, field, 'Message must be decoded with a Serializer.');
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
  isMessage() {
    return true;
  }

  /**
   * {@inheritdoc}
   */
  allowedInSet() {
    return false;
  }
}
