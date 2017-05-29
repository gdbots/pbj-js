'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class NoMessageForMixin extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Mixin mixin
   */
  constructor(mixin) {
    super('MessageResolver is unable to find any messages using [' + mixin.getId().getCurieMajor() + '].');

    privateProps.set(this, {
      /** @var Mixin */
      mixin: mixin
    });
  }

  /**
   * @return Mixin
   */
  getMixin() {
    return privateProps.get(this).mixin;
  }
}
