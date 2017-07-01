/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../enums/TypeName';
import Message from '../Message';
import AssertionFailed from '../exceptions/AssertionFailed';
import DecodeValueFailed from '../exceptions/DecodeValueFailed';

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
      return;
    }

    const schema = value.schema();
    if (anyOfCuries.includes(schema.getCurie().toString())) {
      return;
    }

    throw new AssertionFailed(`Field [${field.getName()}] :: Value "${schema.getCurie()}" must be one of: ${anyOfCuries.join(',')}.`);
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
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
   * @param {Codec} [codec]
   *
   * @returns {?Message}
   */
  decode(value, field, codec = null) {
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
