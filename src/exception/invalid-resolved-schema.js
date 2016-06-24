'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class InvalidResolvedSchema extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Schema   schema
   * @param SchemaId resolvedSchemaId
   * @param string   resolvedClassName
   */
  constructor(schema, resolvedSchemaId, resolvedClassName) {
    super('Schema id [' + resolvedSchemaId.toString() + '] with curie [' + resolvedSchemaId.getCurieMajor() + '] was resolved to [' + resolvedClassName + '] but that message has a curie of [' + schema.getId().getCurieMajor() + ']. They must match.');

    privateProps.set(this, {
      /** @var Schema */
      schema: schema,

      /** @var SchemaId */
      resolvedSchemaId: resolvedSchemaId,

      /** @var string */
      resolvedClassName: resolvedClassName
    });
  }

  /**
   * @return SchemaId
   */
  getResolvedSchemaId() {
    return privateProps.get(this).resolvedSchemaId;
  }

  /**
   * @return string
   */
  getResolvedClassName() {
    return privateProps.get(this).resolvedClassName;
  }
}
