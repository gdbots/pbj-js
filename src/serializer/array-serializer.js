'use strict';

import GeoPoint from 'gdbots/common/geo-point';
import ArrayUtils from 'gdbots/common/util/array-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import DeserializeMessageFailed from 'gdbots/pbj/exception/deserialize-message-failed';
import EncodeValueFailed from 'gdbots/pbj/exception/encode-value-failed';
import Serializer from 'gdbots/pbj/serializer/serializer';
import TypeName from 'gdbots/pbj/enum/type-name';
import FieldRule from 'gdbots/pbj/enum/field-rule';
import MessageRef from 'gdbots/pbj/message-ref';
import {PBJ_FIELD_NAME} from 'gdbots/pbj/schema';

export default class ArraySerializer extends SystemUtils.mixinClass(Serializer)
{
  /**
   * {@inheritdoc}
   */
  serialize(message, options = {}) {
    return doSerialize.bind(this)(message, options);
  }

  /**
   * {@inheritdoc}
   */
  deserialize(data, options = {}) {
    if (-1 === Object.keys(data).indexOf(PBJ_FIELD_NAME)) {
      throw new Error('[' + this.constructor.name + '::deserialize] Array provided must contain the [' + PBJ_FIELD_NAME +'] key.');
    }

    return doDeserialize.bind(this)(data, options);
  }
}

/**
 * @param Message message
 * @param array   options
 *
 * @return array
 */
function doSerialize(message, options = {}) {
  let schema = message.constructor.schema();
  message.validate();

  let payload = {};
  let includeAllFields = undefined !== options.includeAllFields && true === options.includeAllFields;

  ArrayUtils.each(schema.getFields(), function(field) {
    let fieldName = field.getName();

    if (!message.has(fieldName)) {
      if (includeAllFields || message.hasClearedField(fieldName)) {
        payload[fieldName] = null;
      }

      return;
    }

    let value = message.get(fieldName);

    switch (field.getRule()) {
      case FieldRule.A_SINGLE_VALUE:
        payload[fieldName] = encodeValue.bind(this)(value, field, options);

        break;

      case FieldRule.A_SET:
      case FieldRule.A_LIST:
        payload[fieldName] = [];

        ArrayUtils.each(value, function(v) {
          payload[fieldName].push(encodeValue.bind(this)(v, field, options));
        }.bind(this));

        break;

      case FieldRule.A_MAP:
        payload[fieldName] = {};

        ArrayUtils.each(value, function(v) {
          payload[fieldName][k] = encodeValue.bind(this)(v, field, options);
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
 * @param array options
 *
 * @return Message
 *
 * @throws \Exception
 * @throws GdbotsPbjException
 */
function doDeserialize(data, options = {}) {
  let message = this.createMessage(data[PBJ_FIELD_NAME]);
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

    switch (field.getRule()) {
      case FieldRule.A_SINGLE_VALUE:
        message.set(fieldName, decodeValue.bind(this)(value, field, options));
        break;

      case FieldRule.A_SET:
      case FieldRule.A_LIST:
        if (!Array.isArray(value)) {
          throw new Error('Field [' + fieldName + '] must be an array.');
        }

        let values = [];

        ArrayUtils.each(value, function(v) {
          values.push(decodeValue.bind(this)(v, field, options));
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
          message.addToMap(fieldName, k, decodeValue.bind(this)(v, field, options));
        }.bind(this));

        break;

      default:
        break;
    }
  }.bind(this));

  return message.set(PBJ_FIELD_NAME, schema.getId().toString()).populateDefaults();
}

/**
 * @param mixed value
 * @param Field field
 * @param array options
 *
 * @return mixed
 *
 * @throws EncodeValueFailed
 */
function encodeValue(value, field, options) {
  let type = field.getType();

  if (type.encodesToScalar()) {
    return type.encode(value, field);
  }

  if (value.hasTrait('Message')) {
    return doSerialize.bind(this)(value, options);
  }

  if (value.hasTrait('ToArray')) {
    return value.toArray();
  }

  throw new EncodeValueFailed(value, field, this.constructor.name + ' has no handling for this value.');
}

/**
 * @param mixed value
 * @param Field field
 * @param array options
 *
 * @return mixed
 *
 * @throws DecodeValueFailed
 */
function decodeValue(value, field, options) {
  let type = field.getType();
  if (type.encodesToScalar()) {
    return type.decode(value, field);
  }

  if (type.isMessage()) {
    return this.deserialize(value, options);
  }

  if (type.getTypeName() === TypeName.GEO_POINT) {
    return GeoPoint.fromArray(value);
  }

  if (type.getTypeName() === TypeName.MESSAGE_REF) {
    return MessageRef.fromArray(value);
  }

  throw new DecodeValueFailed(value, field, this.constructor.name + ' has no handling for this value.');
}
