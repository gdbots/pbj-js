'use strict';

import ArrayUtils from 'gdbots/common/util/array-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import EncodeValueFailed from 'gdbots/pbj/exception/encode-value-failed';
import DecodeValueFailed from 'gdbots/pbj/exception/decode-value-failed';
import Type from 'gdbots/pbj/type/type';

export default class MessageType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!value.hasTrait('Message')) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "Message" but is not.');
    }

    if (field.hasInstance() && field.getInstance().name !== SystemUtils.getClass(value)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "' + field.getInstance().name + '" but is not.');
    }

    if (!field.getAnyOfInstances()) {
      return;
    }

    let instances = field.getAnyOfInstances();
    if (!instances || instances.length === 0) {
      // means it can be "any message"
      return;
    }

    let found = false;
    let classNames = [];
    ArrayUtils.each(instances, function(instance) {
      classNames.push(instance.name);

      if (value.hasTrait(instance.name) || instance.name === SystemUtils.getClass(value)) {
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
