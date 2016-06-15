'use strict';

import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class MoreThanOneMessageForMixin extends GdbotsPbjException
{
  /**
   * @param Mixin    mixin
   * @param Schema[] schemas
   */
  constructor(mixin, schemas) {
    let ids = schemas.map(function(schema) {
        return schema.getId().toString() + ' => ' + schema.getClassName();
    });

    super('MessageResolver returned multiple messages using [' + mixin.getId().getCurieMajor() + '] when one was expected. Messages found: ' + "\n" + ids.join("\n"));

    /** @var Mixin */
    this.mixin = mixin;

    /** @var Schema[] */
    this.schemas = schemas;
  }

  /**
   * @return Mixin
   */
  getMixin() {
    return this.mixin;
  }

  /**
   * @return Schema[]
   */
  getSchemas() {
    return this.schemas;
  }
}
