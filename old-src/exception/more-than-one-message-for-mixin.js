'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class MoreThanOneMessageForMixin extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Mixin     mixin
   * @param Message[] messages
   */
  constructor(mixin, messages) {
    let ids = messages.map(function(message) {
      let schema = message.schema();
      return schema.getId().toString() + ' => ' + schema.getClassName();
    });

    super('MessageResolver returned multiple messages using [' + mixin.getId().getCurieMajor() + '] when one was expected. Messages found: ' + "\n" + ids.join("\n"));

    privateProps.set(this, {
      /** @var Mixin */
      mixin: mixin,

      /** @var Message[] */
      messages: messages
    });
  }

  /**
   * @return Mixin
   */
  getMixin() {
    return privateProps.get(this).mixin;
  }

  /**
   * @return Message[]
   */
  getMessage() {
    return privateProps.get(this).messages;
  }
}
