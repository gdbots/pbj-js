'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class FieldOverrideNotCompatible extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Schema schema
   * @param string fieldName
   * @param Field  overrideField
   */
  constructor(schema, fieldName, overrideField) {
    let existingField = schema.getField(fieldName);

    super('Field [' + existingField.getName() + '] override for [' + schema.getClassName() + '] is not compatible. Name, Type, Rule and Required must match.');

    privateProps.set(this, {
      /** @var Schema */
      schema: schema,

      /** @var Field */
      existingField: existingField,

      /** @var Field */
      overrideField: overrideField
    });
  }

  /**
   * @return Field
   */
  getExistingField() {
    return privateProps.get(this).existingField;
  }

  /**
   * @return string
   */
  getFieldName() {
    return privateProps.get(this).existingField.getName();
  }

  /**
   * @return Field
   */
  getOverrideField() {
    return privateProps.get(this).overrideField;
  }
}
