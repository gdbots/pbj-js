'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class FrozenMessageIsImmutable extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Message type
   */
  constructor(type) {
    super('Message is frozen and cannot be modified.');

    privateProps.set(this, {
      /** @var Message */
      type: type
    });
  }

  /**
   * @return Message
   */
  getType() {
    return privateProps.get(this).type;
  }
}
