/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../enums/TypeName';
import MessageRef from '../well-known/MessageRef';
import AssertionFailed from '../exceptions/AssertionFailed';
import DecodeValueFailed from '../exceptions/DecodeValueFailed';

export default class MessageRefType extends Type {
  constructor() {
    super(TypeName.MESSAGE_REF);
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
   * @param {Object} [codec]
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
   * @param {Object} [codec]
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

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return false;
  }
}
