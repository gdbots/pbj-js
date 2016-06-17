'use strict';

import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class MoreThanOneMessageForMixin extends GdbotsPbjException
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

    /** @var Mixin */
    this.mixin = mixin;

    /** @var Message[] */
    this.messages = messages;
  }

  /**
   * @return Mixin
   */
  getMixin() {
    return this.mixin;
  }

  /**
   * @return Message[]
   */
  getMessage() {
    return this.messages;
  }
}
