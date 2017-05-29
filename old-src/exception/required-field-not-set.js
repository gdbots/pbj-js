'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class RequiredFieldNotSet extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Message type
   * @param Field   field
   */
  constructor(type, field) {
    super('Required field [' + field.getName() + '] must be set on message [' + type.constructor.schema().getClassName() + '].');

    privateProps.set(this, {
      /** @var Message */
      type: type,

      /** @var Schema */
      schema: type.constructor.schema(),

      /** @var Field */
      field: field
    });
  }

  /**
   * @return Message
   */
  getType() {
    return privateProps.get(this).type;
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
