'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class DecodeValueFailed extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param mixed  value
   * @param Field  field
   * @param string message
   */
  constructor(value, field, message) {
    let str = '' + value;
    if ('object' === typeof value) {
      str = value.toString();
    }

    super('Failed to decode [' + str + '] for field [' + field.getName() + '] to a [' + field.getType().getTypeValue() + ']. Detail: ' + message + '.');

    privateProps.set(this, {
      /** @var mixed */
      value: value,

      /** @var Field */
      field: field
    });
  }

  /**
   * @return mixed
   */
  getValue() {
    return privateProps.get(this).value;
  }

  /**
   * @return Field
   */
  getField() {
    return privateProps.get(this).field;
  }

  /**
   * @return string
   */
  getFieldName() {
    return privateProps.get(this).field.getName();
  }
}
