'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class FieldNotDefined extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Schema schema
   * @param string fieldName
   */
  constructor(schema, fieldName) {
    super('Field [' + fieldName + '] is not defined on message [' + schema.getClassName() + '].');

    privateProps.set(this, {
      /** @var Schema */
      schema: schema,

      /** @var string */
      fieldName: fieldName
    });
  }

  /**
   * @return string
   */
  getFieldName() {
    return privateProps.get(this).fieldName;
  }
}
