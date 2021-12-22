import Type from './Type.js';
import TypeName from '../enums/TypeName.js';
import Identifier from '../well-known/Identifier.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';
import DecodeValueFailed from '../exceptions/DecodeValueFailed.js';

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

    if (value.constructor.name !== field.getClassProto().name) {
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
   * @param {Object} [codec]
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
   * @param {Object} [codec]
   *
   * @returns {?Identifier}
   */
  decode(value, field, codec = null) {
    const expectedProto = field.getClassProto();
    if (value === null || value.constructor.name === expectedProto) {
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
    return 255;
  }
}
