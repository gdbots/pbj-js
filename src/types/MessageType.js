import intersection from 'lodash-es/intersection.js';
import Type from './Type.js';
import TypeName from '../enums/TypeName.js';
import Message from '../Message.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';
import DecodeValueFailed from '../exceptions/DecodeValueFailed.js';

export default class MessageType extends Type {
  constructor() {
    super(TypeName.MESSAGE);
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!(value instanceof Message)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] was expected to be a Message.`);
    }

    const anyOfCuries = field.getAnyOfCuries();
    if (!anyOfCuries.length) {
      // means it can be "any message"
      return;
    }

    const schema = value.schema();
    const curies = [schema.getCurie().toString(), ...schema.getMixins()];

    if (intersection(anyOfCuries, curies).length) {
      return;
    }

    throw new AssertionFailed(`Field [${field.getName()}] :: Value "${schema.getCurie()}" must be one of: ${anyOfCuries.join(',')}.`);
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {*}
   */
  encode(value, field, codec = null) {
    if (value instanceof Message) {
      return codec.encodeMessage(value, field);
    }

    return null;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {?Message}
   */
  async decode(value, field, codec = null) {
    if (value === null || value instanceof Message) {
      return value;
    }

    try {
      return codec.decodeMessage(value, field);
    } catch (e) {
      throw new DecodeValueFailed(value, field, e.message);
    }
  }

  /**
   * @returns {boolean}
   */
  isScalar() {
    return false;
  }

  /**
   * @returns {boolean}
   */
  encodesToScalar() {
    return false;
  }

  /**
   * @returns {boolean}
   */
  isMessage() {
    return true;
  }

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return false;
  }
}
