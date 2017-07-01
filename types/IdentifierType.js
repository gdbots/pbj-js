/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../enums/TypeName';
import Identifier from '../well-known/Identifier';
import AssertionFailed from '../exceptions/AssertionFailed';
import DecodeValueFailed from '../exceptions/DecodeValueFailed';

export default class IdentifierType extends Type {
  constructor() {
    super(TypeName.IDENTIFIER);
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!(value instanceof Identifier)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] was expected to be an Identifier.`);
    }

    if (!(value instanceof field.getClassProto())) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" was expected to be a "${field.getClassProto().name}".`);
    }

    const str = value.toString();
    if (str.length < 1 || str.length > this.getMaxBytes()) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Must be between [1] and [${this.getMaxBytes()}] bytes, [${str.length}] bytes given.`);
    }
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?string}
   */
  encode(value, field, codec = null) {
    if (value instanceof Identifier) {
      return value.toString();
    }

    return null;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?Identifier}
   */
  decode(value, field, codec = null) {
    const expectedProto = field.getClassProto();
    if (value === null || value instanceof expectedProto) {
      return value;
    }

    try {
      return expectedProto.fromString(`${value}`);
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
  isString() {
    return true;
  }

  /**
   * @returns {number}
   */
  getMaxBytes() {
    return 100;
  }
}