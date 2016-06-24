'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class FieldAlreadyDefined extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Schema schema
   * @param string fieldName
   */
  constructor(schema, fieldName) {
    let field = schema.getField(fieldName);

    super('Field [' + field.getName() + '] is already defined on message [' + schema.getClassName() + '] and is not overridable.');

    privateProps.set(this, {
      /** @var Schema */
      schema: schema,

      /** @var Field */
      field: field
    });
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
