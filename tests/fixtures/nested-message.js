'use strict';

import GeoPointType from 'gdbots/pbj/type/geo-point-type';
import IntType from 'gdbots/pbj/type/int-type';
import MessageRefType from 'gdbots/pbj/type/message-ref-type';
import StringType from 'gdbots/pbj/type/string-type';
import Fb from 'gdbots/pbj/field-builder';
import MessageRef from 'gdbots/pbj/message-ref';
import MessageResolver from 'gdbots/pbj/message-resolver';
import Message from 'gdbots/pbj/message';
import Schema from 'gdbots/pbj/schema';

export default class NestedMessage extends Message
{
  /**
   * @return Schema
   */
  static defineSchema() {
    let schema = new Schema('pbj:gdbots:tests.pbj:fixtures:nested-message:1-0-0', this.name,
      [
        Fb.create('test1', StringType.create()).build(),
        Fb.create('test2', IntType.create()).asASet().build(),
        Fb.create('location', GeoPointType.create()).build(),
        Fb.create('refs', MessageRefType.create()).asASet().build()
      ]
    );

    MessageResolver.registerSchema(schema);

    return schema;
  }

  /**
   * {@inheritdoc}
   */
  generateMessageRef(tag = null) {
    return new MessageRef(this.constructor.schema().getCurie(), null, tag);
  }

  /**
   * {@inheritdoc}
   */
  getUriTemplateVars() {
    return {};
  }
}
