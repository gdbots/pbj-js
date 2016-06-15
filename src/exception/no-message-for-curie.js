'use strict';

import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class NoMessageForCurie extends GdbotsPbjException
{
  /**
   * @param SchemaCurie curie
   */
  constructor(curie) {
    super('MessageResolver is unable to resolve [' + curie.toString() + '] to a class name.');

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
