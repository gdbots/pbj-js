'use strict';

import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class InvalidResolvedSchema extends GdbotsPbjException
{
  /**
   * @param Schema   schema
   * @param SchemaId resolvedSchemaId
   * @param string   resolvedClassName
   */
  constructor(schema, resolvedSchemaId, resolvedClassName) {
    super('Schema id [' + resolvedSchemaId.toString() + '] with curie [' + resolvedSchemaId.getCurieMajor() + '] was resolved to [' + resolvedClassName + '] but that message has a curie of [' + schema.getId().getCurieMajor() + ']. They must match.');

    /** @var Schema */
    this.schema = schema;

    /** @var SchemaId */
    this.resolvedSchemaId = resolvedSchemaId;

    /** @var string */
    this.resolvedClassName = resolvedClassName;
  }

  /**
   * @return SchemaId
   */
  getResolvedSchemaId() {
    return this.resolvedSchemaId;
  }

  /**
   * @return string
   */
  getResolvedClassName() {
    return this.resolvedClassName;
  }
}
