'use strict';

import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class FieldNotDefined extends GdbotsPbjException
{
  /**
   * @param Schema schema
   * @param string fieldName
   */
  constructor(schema, fieldName) {
    super('Field [' + fieldName + '] is not defined on message [' + schema.getClassName() + '].');

    /** @var Schema */
    this.schema = schema;

    /** @var string */
    this.fieldName = fieldName;
  }

  /**
   * @return string
   */
  getFieldName() {
    return this.fieldName;
  }
}
