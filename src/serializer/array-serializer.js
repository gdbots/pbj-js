'use strict';

import GeoPoint from 'gdbots/pbj/well-known/geo-point';
import DynamicField from 'gdbots/pbj/well-known/dynamic-field';
import ArrayUtils from 'gdbots/common/util/array-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import DeserializeMessageFailed from 'gdbots/pbj/exception/deserialize-message-failed';
import EncodeValueFailed from 'gdbots/pbj/exception/encode-value-failed';
import InvalidResolvedSchema from 'gdbots/pbj/exception/invalid-resolved-schema';
import Serializer from 'gdbots/pbj/serializer/serializer';
import TypeName from 'gdbots/pbj/enum/type-name';
import FieldRule from 'gdbots/pbj/enum/field-rule';
import Codec from 'gdbots/pbj/codec';
import MessageRef from 'gdbots/pbj/message-ref';
import MessageResolver from 'gdbots/pbj/message-resolver';
import SchemaId from 'gdbots/pbj/schema-id';
import {PBJ_FIELD_NAME} from 'gdbots/pbj/schema';

/**
 * Options for the serializer to use, e.g. json encoding options,
 * 'includeAllFields' which includes fields even if they're not set, etc.
 *
 * @var array
 */
let _options = {};

export default class ArraySerializer extends SystemUtils.mixinClass(Serializer, Codec)
{
  /**
   * {@inheritdoc}
   */
  serialize(message, options = {}) {
    _options = options;

    return doSerialize.bind(this)(message);
  }

  /**
   * {@inheritdoc}
   */
  deserialize(data, options = {}) {
    _options = options;

    if (-1 === Object.keys(data).indexOf(PBJ_FIELD_NAME)) {
      throw new Error('[' + this.constructor.name + '::deserialize] Array provided must contain the [' + PBJ_FIELD_NAME +'] key.');
    }

    return doDeserialize.bind(this)(data);
  }

  /**
   * @param Message message
   * @param Field field
   *
   * @return mixed
   */
  encodeMessage(message, field) {
    return doSerialize.bind(this)(message);
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return Message
   */
  decodeMessage(value, field) {
    return doDeserialize.bind(this)(value);
  }

  /**
   * @param MessageRef messageRef
   * @param Field field
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
   * @param Field field
   *
   * @return mixed
   */
  encodeGeoPoint(geoPoint, field) {
    return geoPoint.toArray();
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return GeoPoint
   */
  decodeGeoPoint(value, field) {
    return GeoPoint.fromArray(value);
  }

  /**
   * @param DynamicField dynamicField
   * @param Field field
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
 * @return array
 */
function doSerialize(message) {
  let schema = message.constructor.schema();
  message.validate();

  let payload = {};
  let includeAllFields = undefined !== _options.includeAllFields && true === _options.includeAllFields;

  ArrayUtils.each(schema.getFields(), function(field) {
    let fieldName = field.getName();

    if (!message.has(fieldName)) {
      if (includeAllFields || message.hasClearedField(fieldName)) {
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

        ArrayUtils.each(value, function(v) {
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
function doDeserialize(data) {

  /** @var SchemaId schemaId */
  let schemaId = SchemaId.fromString(data[PBJ_FIELD_NAME]);

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

    switch (field.getRule()) {
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
