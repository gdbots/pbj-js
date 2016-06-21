'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class MixinNotDefined extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Schema schema
   * @param string mixinId
   */
  constructor(schema, mixinId) {
    super('Mixin [' + mixinId + '] is not defined on message [' + schema.getClassName() + '].');

    /** @var Schema */
    this.schema = schema;

    /** @var string */
    this.mixinId = mixinId;
  }

  /**
   * @return string
   */
  getMixinId() {
    return this.mixinId;
  }
}
