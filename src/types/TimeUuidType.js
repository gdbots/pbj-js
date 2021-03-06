import Type from './Type';
import TypeName from '../enums/TypeName';
import TimeUuidIdentifier from '../well-known/TimeUuidIdentifier';
import AssertionFailed from '../exceptions/AssertionFailed';
import DecodeValueFailed from '../exceptions/DecodeValueFailed';

export default class TimeUuidType extends Type {
  constructor() {
    super(TypeName.TIME_UUID);
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!(value instanceof TimeUuidIdentifier)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] was expected to be a TimeUuidIdentifier.`);
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
    if (value instanceof TimeUuidIdentifier) {
      return value.toString();
    }

    return null;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {?TimeUuidIdentifier}
   */
  decode(value, field, codec = null) {
    const expectedProto = field.hasClassProto() ? field.getClassProto() : TimeUuidIdentifier;
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
   * @returns {TimeUuidIdentifier}
   */
  getDefault() {
    return TimeUuidIdentifier.generate();
  }

  /**
   * @returns {boolean}
   */
  isString() {
    return true;
  }
}
