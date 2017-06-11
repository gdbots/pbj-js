/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../Enum/TypeName';
import MessageRef from '../MessageRef';
import AssertionFailed from '../Exception/AssertionFailed';
import DecodeValueFailed from '../Exception/DecodeValueFailed';

/** @type {MessageRefType} */
let instance = null;

export default class MessageRefType extends Type {
  constructor() {
    super(TypeName.MESSAGE_REF);
  }

  /**
   * @returns {MessageRefType}
   */
  static create() {
    if (instance === null) {
      instance = new MessageRefType();
    }

    return instance;
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!(value instanceof MessageRef)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] was expected to be a MessageRef.`);
    }
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {*}
   */
  encode(value, field, codec = null) {
    if (value instanceof MessageRef) {
      return codec.encodeMessageRef(value, field);
    }

    return null;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?MessageRef}
   */
  decode(value, field, codec = null) {
    if (value === null || value instanceof MessageRef) {
      return value;
    }

    try {
      return codec.decodeMessageRef(value, field);
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
}