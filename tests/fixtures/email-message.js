'use strict';

import Priority from './enum/priority';
import Provider from './enum/provider';
import NestedMessage from './nested-message';
import SystemUtils from 'gdbots/common/util/system-utils';
import Format from 'gdbots/pbj/enum/format';
import BooleanType from 'gdbots/pbj/type/boolean-type';
import DateTimeType from 'gdbots/pbj/type/date-time-type';
import IntEnumType from 'gdbots/pbj/type/int-enum-type';
import MessageType from 'gdbots/pbj/type/message-type';
import MicrotimeType from 'gdbots/pbj/type/microtime-type';
import StringType from 'gdbots/pbj/type/string-type';
import StringEnumType from 'gdbots/pbj/type/string-enum-type';
import TimeUuidType from 'gdbots/pbj/type/time-uuid-type';
import Fb from 'gdbots/pbj/field-builder';
import MessageRef from 'gdbots/pbj/message-ref';
import MessageResolver from 'gdbots/pbj/message-resolver';
import Message from 'gdbots/pbj/message';
import Schema from 'gdbots/pbj/schema';

export default class EmailMessage extends SystemUtils.mixinClass(Message)
{
  /**
   * @return Schema
   */
  static defineSchema() {
    let schema = new Schema('pbj:gdbots:tests.pbj:fixtures:email-message:1-0-0', this.name,
      [
        Fb.create('id', TimeUuidType.create())
          .required()
          .build(),
        Fb.create('from_name', StringType.create())
          .build(),
        Fb.create('from_email', StringType.create())
          .required()
          .format('email')
          .build(),
        Fb.create('subject', StringType.create())
          .withDefault(function (message = null) {
            if (!message) {
              return null;
            }
            return message.get('labels', []).join(',') + ' test';
          })
          .build(),
        Fb.create('body', StringType.create()).build(),
        Fb.create('priority', IntEnumType.create())
          .required()
          .instance(Priority)
          .withDefault(Priority.NORMAL)
          .build(),
        Fb.create('sent', BooleanType.create()).build(),
        Fb.create('date_sent', DateTimeType.create()).build(),
        Fb.create('microtime_sent', MicrotimeType.create()).build(),
        Fb.create('provider', StringEnumType.create())
          .instance(Provider)
          .withDefault(Provider.GMAIL)
          .build(),
        Fb.create('labels', StringType.create())
          .format(Format.HASHTAG.getValue())
          .asASet()
          .build(),
        Fb.create('nested', MessageType.create())
          .instance(NestedMessage)
          .build(),
        Fb.create('enum_in_set', StringEnumType.create())
          .instance(Provider)
          .asASet()
          .build(),
        Fb.create('enum_in_list', StringEnumType.create())
          .instance(Provider)
          .asAList()
          .build(),
        Fb.create('any_of_message', MessageType.create())
          .instance(Message)
          .asAList()
          .build(),
      ]
    );

    MessageResolver.registerSchema(this, schema);

    return schema;
  }

  /**
   * {@inheritdoc}
   */
  generateMessageRef(tag = null) {
    return new MessageRef(this.constructor.schema().getCurie(), this.get('id'), tag);
  }

  /**
   * {@inheritdoc}
   */
  getUriTemplateVars() {
    return {
      'id': this.get('id').toString()
    };
  }
}
