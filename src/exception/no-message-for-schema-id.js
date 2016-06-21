'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class NoMessageForSchemaId extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param SchemaId schemaId
   */
  constructor(schemaId) {
    super('MessageResolver is unable to resolve schema id [' + schemaId.toString() + '] using curie [' + schemaId.getCurieMajor() + '] to a message.');

    /** @var SchemaId */
    this.schemaId = schemaId;
  }

  /**
   * @return SchemaId
   */
  getSchemaId() {
    return this.schemaId;
  }
}
