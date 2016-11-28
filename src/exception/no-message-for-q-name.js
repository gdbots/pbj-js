'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import LogicException from 'gdbots/pbj/exception/logic-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class NoMessageForQName extends SystemUtils.mixinClass(LogicException)
{
  /**
   * @param SchemaQName qname
   */
  constructor(qname) {
    super('MessageResolver is unable to resolve [' + qname.toString() + '] to a SchemaCurie.');

    privateProps.set(this, {
      /** @var SchemaQName */
      qname: qname
    });
  }

  /**
   * @return SchemaQName
   */
  getQName() {
    return privateProps.get(this).qname;
  }
}
