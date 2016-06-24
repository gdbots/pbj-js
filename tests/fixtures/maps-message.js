'use strict';

import NestedMessage from './nested-message';
import StringEnum from './enum/string-enum';
import IntEnum from './enum/int-enum';

import StringUtils from 'gdbots/common/util/string-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import TimeUuidIdentifier from 'gdbots/identifiers/time-uuid-identifier';
import Fb from 'gdbots/pbj/field-builder';
import MessageRef from 'gdbots/pbj/message-ref';
import MessageResolver from 'gdbots/pbj/message-resolver';
import Message from 'gdbots/pbj/message';
import Schema from 'gdbots/pbj/schema';

import BigIntType from 'gdbots/pbj/type/big-int-type';
import BinaryType from 'gdbots/pbj/type/binary-type';
import BlobType from 'gdbots/pbj/type/blob-type';
import BooleanType from 'gdbots/pbj/type/boolean-type';
import DateTimeType from 'gdbots/pbj/type/date-time-type';
import DateType from 'gdbots/pbj/type/date-type';
import DecimalType from 'gdbots/pbj/type/decimal-type';
import FloatType from 'gdbots/pbj/type/float-type';
import GeoPointType from 'gdbots/pbj/type/geo-point-type';
import IdentifierType from 'gdbots/pbj/type/identifier-type';
import IntEnumType from 'gdbots/pbj/type/int-enum-type';
import IntType from 'gdbots/pbj/type/int-type';
import MediumBlobType from 'gdbots/pbj/type/medium-blob-type';
import MediumIntType from 'gdbots/pbj/type/medium-int-type';
import MediumTextType from 'gdbots/pbj/type/medium-text-type';
import MessageRefType from 'gdbots/pbj/type/message-ref-type';
import MessageType from 'gdbots/pbj/type/message-type';
import MicrotimeType from 'gdbots/pbj/type/microtime-type';
import SignedBigIntType from 'gdbots/pbj/type/signed-big-int-type';
import SignedIntType from 'gdbots/pbj/type/signed-int-type';
import SignedMediumIntType from 'gdbots/pbj/type/signed-medium-int-type';
import SignedSmallIntType from 'gdbots/pbj/type/signed-small-int-type';
import SignedTinyIntType from 'gdbots/pbj/type/signed-tiny-int-type';
import SmallIntType from 'gdbots/pbj/type/small-int-type';
import StringEnumType from 'gdbots/pbj/type/string-enum-type';
import StringType from 'gdbots/pbj/type/string-type';
import TextType from 'gdbots/pbj/type/text-type';
import TimeUuidType from 'gdbots/pbj/type/time-uuid-type';
import TimestampType from 'gdbots/pbj/type/timestamp-type';
import TinyIntType from 'gdbots/pbj/type/tiny-int-type';
import UuidType from 'gdbots/pbj/type/uuid-type';

export default class MapsMessage extends SystemUtils.mixinClass(Message)
{
  /**
   * @return array
   */
  static getAllTypes() {
    return [
      BigIntType, BinaryType, BlobType, BooleanType, DateTimeType, DateType, DecimalType,
      FloatType, GeoPointType, IdentifierType, IntEnumType, IntType, MediumBlobType, MediumIntType,
      MediumTextType, MessageRefType, MessageType, MicrotimeType, SignedBigIntType, SignedIntType,
      SignedMediumIntType, SignedSmallIntType, SignedTinyIntType, SmallIntType, StringEnumType,
      StringType, TextType, TimeUuidType, TimestampType, TinyIntType, UuidType
    ];
  }

  /**
   * @return Schema
   */
  static defineSchema() {
    let fields = [];

    /** @var Type type */
    for (let type of this.getAllTypes()) {
      let typeName = StringUtils.toSnakeCase(type.name.substring(0, type.name.length-4)).toLowerCase();
      let field = null;

      switch (typeName) {
          case 'identifier':
            field = Fb.create(typeName, type.create())
              .asAMap()
              .instance(TimeUuidIdentifier)
              .build();

            break;

          case 'int_enum':
            field = Fb.create(typeName, type.create())
              .asAMap()
              .instance(IntEnum)
              .build();

            break;

          case 'string_enum':
            field = Fb.create(typeName, type.create())
              .asAMap()
              .instance(StringEnum)
              .build();

            break;

          case 'message':
            field = Fb.create(typeName, type.create())
              .asAMap()
              .instance(NestedMessage)
              .build();

            break;

          default:
            field = Fb.create(typeName, type.create())
              .asAMap()
              .build();
      }

      if (field) {
        fields.push(field);
      }
    }

    let schema = new Schema('pbj:gdbots:tests.pbj:fixtures:maps-message:1-0-0', this.name, fields);

    MessageResolver.registerSchema(this, schema);

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
