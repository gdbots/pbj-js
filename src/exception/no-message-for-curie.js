'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class NoMessageForCurie extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param SchemaCurie curie
   */
  constructor(curie) {
    super('MessageResolver is unable to resolve [' + curie.toString() + '] to a message.');

    privateProps.set(this, {
      /** @var SchemaCurie */
      curie: curie
    });
  }

  /**
   * @return SchemaCurie
   */
  getCurie() {
    return privateProps.get(this).curie;
  }
}
