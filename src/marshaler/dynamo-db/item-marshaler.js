'use strict';

import ArrayUtils from 'gdbots/common/util/array-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import FieldRule from 'gdbots/pbj/enum/field-rule';
import TypeName from 'gdbots/pbj/enum/type-name';
import InvalidResolvedSchema from 'gdbots/pbj/exception/invalid-resolved-schema';
import EncodeValueFailed from 'gdbots/pbj/exception/encode-value-failed';
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

/**
 * Creates an array in the DynamoDb expected attribute value format.
 *
 * @link http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
 * @link http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
 * @link http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DataModel.html#DataModel.DataTypes
 * @link http://blogs.aws.amazon.com/php/post/Tx3QE1CEXG8QG1Z/DynamoDB-JSON-and-Array-Marshaling-for-PHP
 */
export default class ItemMarshaler extends SystemUtils.mixinClass(null, Codec)
{
  /**
   * @param Message message
   *
   * @return array
   *
   * @throws \Exception
   * @throws GdbotsPbjException
   */
  marshal(message) {
    let schema = message.constructor.schema();
    message.validate();

    let payload = {};

    ArrayUtils.each(schema.getFields(), function(field) {
      let fieldName = field.getName();

      if (!message.has(fieldName)) {
        if (message.hasClearedField(fieldName)) {
          payload[fieldName] = {'NULL': true};
        }
        return;
      }

      let value = message.get(fieldName);

      switch (field.getRule()) {
        case FieldRule.A_SINGLE_VALUE:
          payload[fieldName] = encodeValue.bind(this)(value, field);
          break;

        case FieldRule.A_SET:
          payload[fieldName] = encodeASetValue.bind(this)(value, field);
          break;

        case FieldRule.A_LIST:
          let list = [];

          ArrayUtils.each(value, function(v) {
            list.push(encodeValue.bind(this)(v, field));
          }.bind(this));

          payload[fieldName] = {'L': list};
          break;

        case FieldRule.A_MAP:
          let map = {};

          ArrayUtils.each(value, function(v, k) {
            map[k] = encodeValue.bind(this)(v, field);
          }.bind(this));

          payload[fieldName] = {'M': map};
          break;

        default:
          break;
      }
    }.bind(this));

    return payload;
  }

  /**
   * Pass the Item of a result. result.Item
   *
   * @param array data
   *
   * @return Message
   *
   * @throws \Exception
   * @throws GdbotsPbjException
   */
  unmarshal(data) {
    return doUnmarshal.bind(this)({'M': data});
  }

  /**
   * @param Message message
   * @param Field  field
   *
   * @return mixed
   */
  encodeMessage(message, field) {
    return {'M': this.marshal(message)};
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return Message
   */
  decodeMessage(value, field) {
    return this.unmarshal(value);
  }

  /**
   * @param MessageRef messageRef
   * @param Field      field
   *
   * @return mixed
   */
  encodeMessageRef(messageRef, field) {
    return {
      'M': {
        'curie': {'S': messageRef.getCurie().toString()},
        'id': {'S': messageRef.getId()},
        'tag': messageRef.hasTag() ? {'S': messageRef.getTag()} : {'NULL': true}
      }
    };
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return MessageRef
   */
  decodeMessageRef(value, field) {
    return new MessageRef(
      SchemaCurie.fromString(value.curie.S),
      value.id.S,
      undefined !== value.tag.NULL ? null : value.tag.S
    );
  }

  /**
   * @param GeoPoint geoPoint
   * @param Field    field
   *
   * @return mixed
   */
  encodeGeoPoint(geoPoint, field) {
    return {
      'M': {
        'type': {'S': 'Point'},
        'coordinates': {
          'L': [
            {'N': geoPoint.getLongitude().toString()},
            {'N': geoPoint.getLatitude().toString()}
          ]
        }
      }
    };
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return GeoPoint
   */
  decodeGeoPoint(value, field) {
    return new GeoPoint(value.coordinates.L[1].N, valuecoordinates.L[0].N);
  }

  /**
   * @param DynamicField dynamicField
   * @param Field        field
   *
   * @return mixed
   */
  encodeDynamicField(dynamicField, field) {
    let data = {
      'name': {'S': dynamicField.getName()}
    };

    data[dynamicField.getKind()] = encodeValue.bind(this)(dynamicField.getValue(), dynamicField.getField());

    return {'M': data};
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return DynamicField
   */
  decodeDynamicField(value, field) {
    let data = {'name': value.name.S};
    delete value.name;

    let kind = value.keys()[0];
    data[kind] = value[kind].values()[0];

    return DynamicField.fromArray(data);
  }
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
  if (undefined === data.M[PBJ_FIELD_NAME]) {
    throw new Error('[' + this.constructor.name + '::doUnmarshal] Array provided must contain the [' + PBJ_FIELD_NAME + '] key.');
  }

  /** @var SchemaId schemaId */
  let schemaId = SchemaId.fromString(data.M[PBJ_FIELD_NAME].S.toString());

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

  ArrayUtils.each(data.M, function(dynamoValue, fieldName) {
    if (!schema.hasField(fieldName)) {
      return;
    }

    let dynamoType = Object.keys(dynamoValue)[0];
    let value = dynamoValue[dynamoType];

    if ('NULL' === dynamoType) {
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

        if ('L' === dynamoType) {
          ArrayUtils.each(value, function(v) {
            values.push(type.decode(undefined !== v.M ? v.M : v.values[0], field, this));
          }.bind(this));
        } else {
          ArrayUtils.each(value, function(v) {
            values.push(type.decode(v, field, this));
          }.bind(this));
        }

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

/**
 * @param mixed value
 * @param Field field
 *
 * @return mixed
 *
 * @throws EncodeValueFailed
 */
function encodeValue(value, field) {
  let type = field.getType();

  if (type.encodesToScalar()) {
    if (type.isString()) {
      value = type.encode(value, field, this);
      if (value.length === 0) {
        return {'NULL': true};
      } else {
        return {'S': value};
      }
    } else if (type.isNumeric()) {
      return {'N': type.encode(value, field, this).toString()};
    } else if (type.isBoolean()) {
      return {'BOOL': type.encode(value, field, this)};
    } else if (type.isBinary()) {
      value = type.encode(value, field, this);
      if (value.length === 0) {
        return {'NULL': true};
      } else {
        return {'B': value};
      }
    }

    throw new EncodeValueFailed(value, field, this.constructor.name + ' has no handling for this value.');
  }

  return type.encode(value, field, this);
}

/**
 * @param array value
 * @param Field field
 *
 * @return mixed
 *
 * @throws EncodeValueFailed
 */
function encodeASetValue(value, field) {
  let type = field.getType();

  /*
   * A MessageRefType is the only object/map value that can be
   * used in a set.  In this case of DynamoDb, we can store it as
   * a list of maps.
   */
  if (type.getTypeName() === TypeName.MESSAGE_REF) {
    let list = [];

    ArrayUtils.each(value, function(v) {
      list.push(type.encode(v, field, this));
    }.bind(this));

    return {'L': list};
  }

  let dynamoType;
  if (type.isString()) {
    dynamoType = 'SS';
  } else if (type.isNumeric()) {
    dynamoType = 'NS';
  } else if (type.isBinary()) {
    dynamoType = 'BS';
  } else {
    throw new EncodeValueFailed(value, field, this.constructor.name + '::encodeASetValue has no handling for this value.');
  }

  let result = [];
  ArrayUtils.each(value, function(v) {
    if (type.encodesToScalar()) {
      result.push(type.encode(v, field, this).toString());
    } else {
      result.push(v.toString());
    }
  }.bind(this));

  let data = {};
  data[dynamoType] = result;

  return data;
}
