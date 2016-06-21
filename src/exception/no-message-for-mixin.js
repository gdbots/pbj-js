'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class NoMessageForMixin extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Mixin mixin
   */
  constructor(mixin) {
    super('MessageResolver is unable to find any messages using [' + mixin.getId().getCurieMajor() + '].');

    /** @var Mixin */
    this.mixin = mixin;
  }

  /**
   * @return Mixin
   */
  getMixin() {
    return this.mixin;
  }
}
