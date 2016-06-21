'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class RequiredFieldNotSet extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Message type
   * @param Field   field
   */
  constructor(type, field) {
    super('Required field [' + field.getName() + '] must be set on message [' + type.constructor.schema().getClassName() + '].');

    /** @var Message */
    this.type = type;

    /** @var Schema */
    this.schema = type.constructor.schema();

    /** @var Field */
    this.field = field;
  }

  /**
   * @return Message
   */
  getType() {
    return this.type;
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
