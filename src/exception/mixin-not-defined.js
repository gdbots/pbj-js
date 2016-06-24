'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class MixinNotDefined extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Schema schema
   * @param string mixinId
   */
  constructor(schema, mixinId) {
    super('Mixin [' + mixinId + '] is not defined on message [' + schema.getClassName() + '].');

    privateProps.set(this, {
      /** @var Schema */
      schema: schema,

      /** @var string */
      mixinId: mixinId
    });
  }

  /**
   * @return string
   */
  getMixinId() {
    return privateProps.get(this).mixinId;
  }
}
