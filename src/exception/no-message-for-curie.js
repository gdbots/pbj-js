'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class NoMessageForCurie extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param SchemaCurie curie
   */
  constructor(curie) {
    super('MessageResolver is unable to resolve [' + curie.toString() + '] to a message.');

    /** @var SchemaCurie */
    this.curie = curie;
  }

  /**
   * @return SchemaCurie
   */
  getCurie() {
    return this.curie;
  }
}
