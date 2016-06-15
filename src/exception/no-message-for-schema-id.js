'use strict';

import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class NoMessageForSchemaId extends GdbotsPbjException
{
  /**
   * @param SchemaId schemaId
   */
  constructor(schemaId) {
    super('MessageResolver is unable to resolve schema id [' + schemaId.toString() + '] using curie [' + schemaId.getCurieMajor() + '] to a class name.');

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
