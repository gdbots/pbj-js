'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class FieldAlreadyDefined extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Schema schema
   * @param string fieldName
   */
  constructor(schema, fieldName) {
    let field = schema.getField(fieldName);

    super('Field [' + field.getName() + '] is already defined on message [' + schema.getClassName() + '] and is not overridable.');

    /** @var Schema */
    this.schema = schema;

    /** @var Field */
    this.field = field;
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
