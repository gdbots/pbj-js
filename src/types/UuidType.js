import Type from './Type.js';
import TypeName from '../enums/TypeName.js';
import UuidIdentifier from '../well-known/UuidIdentifier.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';
import DecodeValueFailed from '../exceptions/DecodeValueFailed.js';

export default class UuidType extends Type {
  constructor() {
    super(TypeName.UUID);
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!(value instanceof UuidIdentifier)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] was expected to be a UuidIdentifier.`);
    }

    if (field.hasClassProto() && !(value instanceof field.getClassProto())) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" was expected to be a "${field.getClassProto().name}".`);
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
    if (value instanceof UuidIdentifier) {
      return value.toString();
    }

    return null;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {?UuidIdentifier}
   */
  decode(value, field, codec = null) {
    const expectedProto = field.hasClassProto() ? field.getClassProto() : UuidIdentifier;
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
   * @returns {UuidIdentifier}
   */
  getDefault() {
    return UuidIdentifier.generate();
  }

  /**
   * @returns {boolean}
   */
  isString() {
    return true;
  }
}
