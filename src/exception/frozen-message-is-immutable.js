'use strict';

import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class FrozenMessageIsImmutable extends GdbotsPbjException
{
  /**
   * @param Message type
   */
  constructor(type) {
    super('Message is frozen and cannot be modified.');

    /** @var Message */
    this.type = type;
  }

  /**
   * @return Message
   */
  getType() {
    return this.type;
  }
}
