'use strict';

import ArrayUtils from 'gdbots/common/util/array-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import FieldRule from 'gdbots/pbj/enum/field-rule';
import TypeName from 'gdbots/pbj/enum/type-name';
import InvalidResolvedSchema from 'gdbots/pbj/exception/invalid-resolved-schema';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';
import DynamicField from 'gdbots/pbj/well-known/dynamic-field';
import GeoPoint from 'gdbots/pbj/well-known/geo-point';
import Codec from 'gdbots/pbj/codec';
import Field from 'gdbots/pbj/field';
import MessageRef from 'gdbots/pbj/message-ref';
import MessageResolver from 'gdbots/pbj/message-resolver';
import Message from 'gdbots/pbj/message';
import SchemaCurie from 'gdbots/pbj/schema-curie';
import SchemaId from 'gdbots/pbj/schema-id';
import {PBJ_FIELD_NAME} from 'gdbots/pbj/schema';

export default class DocumentMarshaler extends SystemUtils.mixinClass(null, Codec)
{
  /**
   * @param Message  message
   * @param Document document
   *
   * @return Document
   *
   * @throws \Exception
   * @throws GdbotsPbjException
   */
  marshal(message, document = null) {
    if (!document) {
      document = {};
    }

    document.data = doMarshal.bind(this)(message);

    return document;
  }

  /**
   * @param Document|array documentOrSource Document object or source array
   *
   * @return Message
   *
   * @throws \Exception
   * @throws GdbotsPbjException
   */
  unmarshal(documentOrSource) {
    if (undefined !== documentOrSource.data) {
      return doUnmarshal.bind(this)(documentOrSource.data);
    }

    return doUnmarshal.bind(this)(documentOrSource);
  }

  /**
   * @param Message message
   * @param Field  field
   *
   * @return mixed
   */
  encodeMessage(message, field) {
    return doMarshal.bind(this)(message);
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return Message
   */
  decodeMessage(value, field) {
    return doUnmarshal.bind(this)(value);
  }

  /**
   * @param MessageRef messageRef
   * @param Field      field
   *
   * @return mixed
   */
  encodeMessageRef(messageRef, field) {
    return messageRef.toArray();
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return MessageRef
   */
  decodeMessageRef(value, field) {
    return MessageRef.fromArray(value);
  }

  /**
   * @param GeoPoint geoPoint
   * @param Field    field
   *
   * @return mixed
   */
  encodeGeoPoint(geoPoint, field) {
    return [geoPoint.getLongitude(), geoPoint.getLatitude()];
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return GeoPoint
   */
  decodeGeoPoint(value, field) {
    return new GeoPoint(value[1], value[0]);
  }

  /**
   * @param DynamicField dynamicField
   * @param Field        field
   *
   * @return mixed
   */
  encodeDynamicField(dynamicField, field) {
    return dynamicField.toArray();
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return DynamicField
   */
  decodeDynamicField(value, field) {
    return DynamicField.fromArray(value);
  }
}

/**
 * @param Message message
 *
 * @return Message
 *
 * @throws \Exception
 * @throws GdbotsPbjException
 */
function doMarshal(message) {
  let schema = message.constructor.schema();
  message.validate();

  let payload = {};

  ArrayUtils.each(schema.getFields(), function(field) {
    let fieldName = field.getName();

    if (!message.has(fieldName)) {
      if (message.hasClearedField(fieldName)) {
        payload[fieldName] = null;
      }
      return;
    }

    let value = message.get(fieldName);
    let type = field.getType();

    switch (field.getRule()) {
      case FieldRule.A_SINGLE_VALUE:
        payload[fieldName] = type.encode(value, field, this);
        break;

      case FieldRule.A_SET:
      case FieldRule.A_LIST:
        payload[fieldName] = [];

        ArrayUtils.each(value, function(v) {
          payload[fieldName].push(type.encode(v, field, this));
        }.bind(this));

        break;

      case FieldRule.A_MAP:
        payload[fieldName] = {};

        ArrayUtils.each(value, function(v, k) {
          payload[fieldName][k] = type.encode(v, field, this);
        }.bind(this));

        break;

      default:
        break;
    }
  }.bind(this));

  return payload;
}

/**
 * @param array data
 *
 * @return Message
 *
 * @throws \Exception
 * @throws GdbotsPbjException
 */
function doUnmarshal(data) {
  if (undefined === data[PBJ_FIELD_NAME]) {
    throw new Error('[' + this.constructor.name + '::doUnmarshal] Array provided must contain the [' + PBJ_FIELD_NAME + '] key.');
  }

  /** @var SchemaId schemaId */
  let schemaId = SchemaId.fromString(data[PBJ_FIELD_NAME].toString());

  /** @var Message message */
  let message = MessageResolver.resolveId(schemaId);
  if (!message.hasTrait('Message')) {
    throw new Error('Invalid message.');
  }

  message = message.create();

  if (message.constructor.schema().getCurieMajor() !== schemaId.getCurieMajor()) {
    throw new InvalidResolvedSchema(message.constructor.schema(), schemaId, message.name);
  }

  let schema = message.constructor.schema();

  ArrayUtils.each(data, function(value, fieldName) {
    if (!schema.hasField(fieldName)) {
      return;
    }

    if (null === value) {
      message.clear(fieldName);
      return;
    }

    let field = schema.getField(fieldName);
    let type = field.getType();

    switch (field.getRule().getValue()) {
      case FieldRule.A_SINGLE_VALUE:
        message.set(fieldName, type.decode(value, field, this));
        break;

      case FieldRule.A_SET:
      case FieldRule.A_LIST:
        if (!Array.isArray(value)) {
          throw new Error('Field [' + fieldName + '] must be an array.');
        }

        let values = [];

        ArrayUtils.each(value, function(v) {
          values.push(type.decode(v, field, this));
        }.bind(this));

        if (field.isASet()) {
          message.addToSet(fieldName, values);
        } else {
          message.addToList(fieldName, values);
        }

        break;

      case FieldRule.A_MAP:
        if (!ArrayUtils.isAssoc(value)) {
          throw new Error('Field [' + fieldName + '] must be an associative array.');
        }

        ArrayUtils.each(value, function(v, k) {
          message.addToMap(fieldName, k, type.decode(v, field, this));
        }.bind(this));

        break;

      default:
        break;
    }
  }.bind(this));

  return message.set(PBJ_FIELD_NAME, schema.getId().toString()).populateDefaults();
}
