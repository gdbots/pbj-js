/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../Enum/TypeName';
import DynamicField from '../WellKnown/DynamicField';
import AssertionFailed from '../Exception/AssertionFailed';
import DecodeValueFailed from '../Exception/DecodeValueFailed';

/** @type DynamicFieldType */
let instance = null;

export default class DynamicFieldType extends Type {
  constructor() {
    super(TypeName.DYNAMIC_FIELD);
  }

  /**
   * @returns {DynamicFieldType}
   */
  static create() {
    if (instance === null) {
      instance = new DynamicFieldType();
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
    if (!(value instanceof DynamicField)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${JSON.stringify(value)}" was expected to be a DynamicField.`);
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
    if (value instanceof DynamicField) {
      return codec.encodeDynamicField(value, field);
    }

    return null;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?DynamicField}
   */
  decode(value, field, codec = null) {
    if (value === null || value instanceof DynamicField) {
      return value;
    }

    try {
      return codec.decodeDynamicField(value, field);
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