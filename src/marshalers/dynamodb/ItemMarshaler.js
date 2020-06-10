import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import AssertionFailed from '../../exceptions/AssertionFailed';
import EncodeValueFailed from '../../exceptions/EncodeValueFailed';
import InvalidResolvedSchema from '../../exceptions/InvalidResolvedSchema';
import DynamicField from '../../well-known/DynamicField';
import GeoPoint from '../../well-known/GeoPoint';
import MessageRef from '../../well-known/MessageRef';
import MessageResolver from '../../MessageResolver';
import { PBJ_FIELD_NAME } from '../../Schema';
import SchemaId from '../../SchemaId';

/**
 * Creates an object in the DynamoDb expected attribute value format.
 *
 * @link https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
 * @link https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
 * @link https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DataModel.html#DataModel.DataTypes
 */
export default class ItemMarshaler {
  /**
   * @param {Message} message
   *
   * @returns {Object}
   *
   * @throws {GdbotsPbjException}
   */
  static marshal(message) {
    const schema = message.schema();
    message.validate();

    const payload = {};

    for (const field of schema.getFields()) {
      const fieldName = field.getName();

      if (!message.has(fieldName)) {
        continue;
      }

      const value = message.get(fieldName);

      if (field.isASingleValue()) {
        payload[fieldName] = this.encodeValue(value, field);
        continue;
      }

      if (field.isASet()) {
        payload[fieldName] = this.encodeASetValue(value, field);
        continue;
      }

      if (field.isAMap()) {
        const map = {};
        for (const k of Object.keys(value)) {
          map[k] = this.encodeValue(value[k], field);
        }
        payload[fieldName] = { M: map };
        continue;
      }

      payload[fieldName] = { L: value.map(v => this.encodeValue(v, field)) };
    }

    return payload;
  }

  /**
   * Pass the item of a getItem request, e.g. data.Item
   * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property
   *
   * @param {Object} obj
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  static async unmarshal(obj) {
    return this.doUnmarshal({ M: obj });
  }

  /**
   * @param {Message} message
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeMessage(message, field) {
    return { M: this.marshal(message) };
  }

  /**
   * @param {Object} value
   * @param {Field} field
   *
   * @returns {Message}
   */
  static async decodeMessage(value, field) {
    return this.unmarshal(value);
  }

  /**
   * @param {MessageRef} messageRef
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeMessageRef(messageRef, field) {
    return {
      M: {
        curie: {
          S: messageRef.getCurie().toString(),
        },
        id: {
          S: messageRef.getId(),
        },
        tag: messageRef.hasTag() ? { S: messageRef.getTag() } : { NULL: true },
      },
    };
  }

  /**
   * @param {Object} value
   * @param {Field} field
   *
   * @returns {MessageRef}
   */
  static decodeMessageRef(value, field) {
    return MessageRef.fromObject({
      curie: value.curie.S,
      id: value.id.S,
      tag: value.tag.S || null,
    });
  }

  /**
   * @param {GeoPoint} geoPoint
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeGeoPoint(geoPoint, field) {
    return {
      M: {
        type: {
          S: 'Point',
        },
        coordinates: {
          L: [
            {
              N: `${geoPoint.getLongitude()}`,
            },
            {
              N: `${geoPoint.getLatitude()}`,
            },
          ],
        },
      },
    };
  }

  /**
   * @param {Object} value
   * @param {Field} field
   *
   * @returns {GeoPoint}
   */
  static decodeGeoPoint(value, field) {
    return GeoPoint.fromObject({
      type: 'Point',
      coordinates: [
        value.coordinates.L[0].N, // long
        value.coordinates.L[1].N, // lat
      ],
    });
  }

  /**
   * @param {DynamicField} dynamicField
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeDynamicField(dynamicField, field) {
    return {
      M: {
        name: {
          S: dynamicField.getName(),
        },
        [dynamicField.getKind()]: this.encodeValue(
          dynamicField.getValue(), dynamicField.getField(),
        ),
      },
    };
  }

  /**
   * @param {Object} value
   * @param {Field} field
   *
   * @returns {DynamicField}
   */
  static decodeDynamicField(value, field) {
    const obj = { name: value.name.S };
    const kind = Object.keys(value).filter(key => key !== 'name')[0];
    obj[kind] = Object.values(value[kind])[0];
    return DynamicField.fromObject(obj);
  }

  /**
   * @private
   *
   * @param {Object} obj
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  static async doUnmarshal(obj) {
    if (!obj.M[PBJ_FIELD_NAME]) {
      throw new AssertionFailed(`Object provided must contain the [${PBJ_FIELD_NAME}] key.`);
    }

    const schemaId = SchemaId.fromString(obj.M[PBJ_FIELD_NAME].S);
    const message = new (await MessageResolver.resolveId(schemaId));
    const schema = message.schema();

    if (schema.getCurieMajor() !== schemaId.getCurieMajor()) {
      throw new InvalidResolvedSchema(schema, schemaId);
    }

    for (const fieldName of Object.keys(obj.M)) {
      if (!schema.hasField(fieldName)) {
        continue;
      }

      const dynamoType = Object.keys(obj.M[fieldName])[0];
      const value = obj.M[fieldName][dynamoType];

      if (dynamoType === 'NULL') {
        message.clear(fieldName);
        continue;
      }

      const field = schema.getField(fieldName);
      const type = field.getType();

      if (field.isASingleValue()) {
        message.set(fieldName, await type.decode(value, field, this));
        continue;
      }

      if (field.isASet() || field.isAList()) {
        if (!isArray(value)) {
          throw new AssertionFailed(`Field [${fieldName}] must be an array.`);
        }

        const values = [];
        if (dynamoType === 'L') {
          for (const v of value) {
            values.push(await type.decode(Object.values(v)[0], field, this));
          }
        } else {
          for (const v of value) {
            values.push(await type.decode(v, field, this));
          }
        }

        if (field.isASet()) {
          message.addToSet(fieldName, values);
        } else {
          message.addToList(fieldName, values);
        }

        continue;
      }

      if (!isPlainObject(value)) {
        throw new AssertionFailed(`Field [${fieldName}] must be an object.`);
      }

      for (const k of Object.keys(value)) {
        message.addToMap(fieldName, k, await type.decode(Object.values(value[k])[0], field, this));
      }
    }

    return message.set(PBJ_FIELD_NAME, schema.getId().toString()).populateDefaults();
  }

  /**
   * @private
   *
   * @param {*} value
   * @param {Field} field
   *
   * @returns {Object}
   *
   * @throws {EncodeValueFailed}
   */
  static encodeValue(value, field) {
    const type = field.getType();

    if (!type.encodesToScalar()) {
      return type.encode(value, field, this);
    }

    if (type.isString()) {
      const strValue = type.encode(value, field, this);
      if (!strValue) {
        return { NULL: true };
      }
      return { S: strValue };
    } else if (type.isNumeric()) {
      return { N: `${type.encode(value, field, this)}` };
    } else if (type.isBoolean()) {
      return { BOOL: type.encode(value, field, this) };
    } else if (type.isBinary()) {
      const binValue = type.encode(value, field, this);
      if (!binValue) {
        return { NULL: true };
      }
      return { B: binValue };
    }

    throw new EncodeValueFailed(value, field, 'ItemMarshaler.encodeValue has no handling for this type.');
  }

  /**
   * @private
   *
   * @param {Array} value
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeASetValue(value, field) {
    const type = field.getType();

    let dynamoType;
    if (type.isString()) {
      dynamoType = 'SS';
    } else if (type.isNumeric()) {
      dynamoType = 'NS';
    } else if (type.isBinary()) {
      dynamoType = 'BS';
    } else {
      throw new EncodeValueFailed(value, field, 'ItemMarshaler.encodeASetValue has no handling for this value.');
    }

    const result = value.map(v => type.encodesToScalar() ? `${type.encode(v, field, this)}` : `${v}`);
    return { [dynamoType]: result };
  }
}
