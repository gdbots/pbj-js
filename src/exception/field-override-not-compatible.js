'use strict';

import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class FieldOverrideNotCompatible extends GdbotsPbjException
{
  /**
   * @param Schema schema
   * @param string fieldName
   * @param Field  overrideField
   */
  constructor(schema, fieldName, overrideField) {
    let existingField = schema.getField(fieldName);

    super('Field [' + existingField.getName() + '] override for [' + schema.getClassName() + '] is not compatible. Name, Type, Rule and Required must match.');

    /** @var Schema */
    this.schema = schema;

    /** @var Field */
    this.existingField = existingField;

    /** @var Field */
    this.overrideField = overrideField;
  }

  /**
   * @return Field
   */
  getExistingField() {
    return this.existingField;
  }

  /**
   * @return string
   */
  getFieldName() {
    return this.existingField.getName();
  }

  /**
   * @return Field
   */
  getOverrideField() {
    return this.overrideField;
  }
}
