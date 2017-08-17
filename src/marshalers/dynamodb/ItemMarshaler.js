import AssertionFailed from '../../exceptions/AssertionFailed';
import EncodeValueFailed from '../../exceptions/EncodeValueFailed';
import InvalidResolvedSchema from '../../exceptions/InvalidResolvedSchema';
import DynamicField from '../../well-known/DynamicField';
import GeoPoint from '../../well-known/GeoPoint';
import MessageRef from '../../MessageRef';
import MessageResolver from '../../MessageResolver';
import { PBJ_FIELD_NAME } from '../../Schema';
import SchemaId from '../../SchemaId';
import TypeName from '../../enums/TypeName';

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

    schema.getFields().forEach((field) => {
      const fieldName = field.getName();
      if (!message.has(fieldName)) {
        if (message.hasClearedField(fieldName)) {
          payload[fieldName] = null;
        }

        return;
      }

      const value = message.get(fieldName);

      if (field.isASingleValue()) {
        payload[fieldName] = this.encodeValue(value, field);
        return;
      }

      if (field.isASet()) {
        payload[fieldName] = this.encodeASetValue(value, field);
        return;
      }

      if (field.isAList()) {
        const list = {};

        // eslint-disable-next-line no-return-assign
        Object.keys(value).forEach(k => list[k] = this.encodeValue(value[k], field));
        payload[fieldName] = { 'L': list };

        return;
      }

      if (field.isAMap()) {
        const map = {};

        // eslint-disable-next-line no-return-assign
        Object.keys(value).forEach(k => map[k] = this.encodeValue(value[k], field));
        payload[fieldName] = { 'M': map };

        return;
      }

      payload[fieldName] = [];
      value.forEach(v => payload[fieldName].push(this.encodeValue(v, field)));
    });

    return payload;
  }

  /**
   * @param {Object} obj
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  static unmarshal(obj) {
    return this.doUnmarshal({ 'M': obj });
  }

  /**
   * @param {Message} message
   *
   * @returns {Object}
   */
  static encodeMessage(message) {
    return { 'M': this.marshal(message) };
  }

  /**
   * @param {Object} value
   *
   * @returns {Message}
   */
  static decodeMessage(value) {
    return this.unmarshal(value);
  }

  /**
   * @param {MessageRef} messageRef
   *
   * @returns {Object}
   */
  static encodeMessageRef(messageRef) {
    return {
      'M': {
        curie: {
          'S': messageRef.getCurie().toString(),
        },
        id: {
          'S': messageRef.getId(),
        },
        tag: messageRef.hasTag() ? { 'S': messageRef.getTag() } : { 'NULL': true },
      },
    };
  }

  /**
   * @param {Object} value
   *
   * @returns {MessageRef}
   */
  static decodeMessageRef(value) {
    const refObject = {
      curie: value['curie']['S'],
      id: value['id']['S'],
      tag: value['tag']['NULL'] ? null : value['tag']['S'],
    };
    return MessageRef.fromObject(refObject);
  }

  /**
   * @param {GeoPoint} geoPoint
   *
   * @returns {Object}
   */
  static encodeGeoPoint(geoPoint) {
    return {
      'M': {
        'type': { 'S': 'Point' },
        'coordinates': {
          'L': [
            { 'N': geoPoint.getLongitude() },
            { 'N': geoPoint.getLatitude() },
          ],
        },
      },
    };
  }

  /**
   * @param {Object} value
   *
   * @returns {GeoPoint}
   */
  static decodeGeoPoint(value) {
    const obj = {
      type: 'Point',
      coordinates: [
        value['coordinates']['L'][1]['N'],
        value['coordinates']['L'][0]['N'],
      ],
    };
    return GeoPoint.fromObject(obj);
  }

  /**
   * @param {DynamicField} dynamicField
   *
   * @returns {Object}
   */
  static encodeDynamicField(dynamicField) {
    return {
      'M': {
        'name': { 'S': dynamicField.getName() },
        [dynamicField.getKind()]: this.encodeValue(dynamicField.getValue(), dynamicField.getField()),
      },
    };
  }

  /**
   * @param {Object} value
   *
   * @returns {DynamicField}
   */
  static decodeDynamicField(value) {
    const data = {
      'name': value['name']['S']
    };
    delete data['name'];

    const kind = value;
    data[kind] = value[kind];

    return DynamicField.fromObject(data);
  }

  /**
   * @param {Object} obj
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  static doUnmarshal(obj) {
    if (!obj['M']) {
      throw new AssertionFailed(`Object provided must contain the [${PBJ_FIELD_NAME}] key.`);
    }

    const schemaId = SchemaId.fromString(obj['M'][PBJ_FIELD_NAME]['S']);
    const message = new (MessageResolver.resolveId(schemaId))();
    const schema = message.schema();

    if (schema.getCurieMajor() !== schemaId.getCurieMajor()) {
      throw new InvalidResolvedSchema(schema, schemaId);
    }

    Object.keys(obj).forEach((fieldName) => {
      if (!schema.hasField(fieldName)) {
        return;
      }

      const value = obj[fieldName];
      if ('NULL' === value) {
        message.clear(fieldName);
        return;
      }

    });

    return message.set(PBJ_FIELD_NAME, schema.getId().toString()).populateDefaults();
  }

  /**
   * @param value
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeValue(value, field) {
    const type = field.getType();

    if (type.encodesToScalar()) {
      if (type.isString()) {
        const strValue = type.encode(value, field, this);
        if (!strValue) {
          return { 'NULL': true };
        }
        return { 'S': strValue };
      } else if (type.isNumeric()) {
        return { 'N': type.encode(value, field, this).toString() };
      } else if (type.isBoolean()) {
        return { 'BOOL': type.encode(value, field, this) };
      } else if (type.isBinary()) {
        const binValue = type.encode(value, field, this);
        if (!binValue) {
          return { 'NULL': true };
        }
        return { 'B': binValue };
      }

      throw new EncodeValueFailed(value, field, 'Unable to encode value');
    }

    return type.encode(value, field, this);
  }

  /**
   * @param {Array} value
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeASetValue(value, field) {
    const type = field.getType();

    /*
     * A MessageRefType is the only object/map value that can be
     * used in a set.  In this case of DynamoDb, we can store it as
     * a list of maps.
     */
    if (type.getTypeName() === TypeName.MESSAGE_REF) {
      const list = [];

      value.forEach((v, f) => {
        list.push(type.encode(v, f, this));
      });

      return { 'L': list };
    }

    let dynamoType;
    if (type.isString()) {
      dynamoType = 'SS';
    } else if (type.isNumeric()) {
      dynamoType = 'NS';
    } else if (type.isBinary()) {
      dynamoType = 'BS';
    } else {
      throw new EncodeValueFailed(value, field, 'Unable to encode value');
    }

    let result = [];
    value.forEach((v, f) => {
      if (type.encodesToScalar()) {
        result.push(type.encode(v, f, this));
      } else {
        result.push(v);
      }
    });

    const returnObject = {};
    returnObject[dynamoType] = result;

    return returnObject;
  }
}
