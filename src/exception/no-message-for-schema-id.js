'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class NoMessageForSchemaId extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param SchemaId schemaId
   */
  constructor(schemaId) {
    super('MessageResolver is unable to resolve schema id [' + schemaId.toString() + '] using curie [' + schemaId.getCurieMajor() + '] to a message.');

    privateProps.set(this, {
      /** @var SchemaId */
      schemaId: schemaId
    });
  }

  /**
   * @return SchemaId
   */
  getSchemaId() {
    return privateProps.get(this).schemaId;
  }
}
