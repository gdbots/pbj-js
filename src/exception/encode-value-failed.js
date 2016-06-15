'use strict';

import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class EncodeValueFailed extends GdbotsPbjException
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

    super('Failed to encode [' + str + '] for field [' + field.getName() + '] to a [' + field.getType().getTypeValue() + ']. Detail: ' + message + '.');

    /** @var mixed */
    this.value = value;

    /** @var Field */
    this.field = field;
  }

  /**
   * @return mixed
   */
  getValue() {
    return this.value;
  }

  /**
   * @return Field
   */
  getField() {
    return this.field;
  }

  /**
   * @return string
   */
  getFieldName() {
    return this.field.getName();
  }
}
