/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../Enum/TypeName';
import TimeUuidIdentifier from '../WellKnown/TimeUuidIdentifier';
import AssertionFailed from '../Exception/AssertionFailed';

/** @type TimeUuidType */
let instance = null;

export default class TimeUuidType extends Type {
  constructor() {
    super(TypeName.TIME_UUID);
  }

  /**
   * @returns {TimeUuidType}
   */
  static create() {
    if (instance === null) {
      instance = new TimeUuidType();
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
    if (!(value instanceof TimeUuidIdentifier)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${JSON.stringify(value)}" was expected to be a TimeUuidIdentifier.`);
    }

    if (field.hasClassProto() && !(value instanceof field.getClassProto())) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" was expected to be a "${field.getClassProto().name}".`);
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
    if (value instanceof TimeUuidIdentifier) {
      return value.toString();
    }

    return null;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?TimeUuidIdentifier}
   */
  decode(value, field, codec = null) {
    const expectedProto = field.hasClassProto() ? field.getClassProto() : TimeUuidIdentifier;
    if (value === null || value instanceof expectedProto) {
      return value;
    }

    return expectedProto.fromString(`${value}`);
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