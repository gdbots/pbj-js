/* eslint-disable class-methods-use-this, no-unused-vars */

import Enum from '@gdbots/common/Enum';
import isString from 'lodash/isString';
import Type from './Type';
import TypeName from '../Enum/TypeName';
import AssertionFailed from '../Exception/AssertionFailed';
import DecodeValueFailed from '../Exception/DecodeValueFailed';

/** @type StringEnumType */
let instance = null;

export default class StringEnumType extends Type {
  constructor() {
    super(TypeName.STRING_ENUM);
  }

  /**
   * @returns {StringEnumType}
   */
  static create() {
    if (instance === null) {
      instance = new StringEnumType();
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
    if (!(value instanceof Enum)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${JSON.stringify(value)}" was expected to be an Enum.`);
    }

    if (!(value instanceof field.getClassProto())) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value.getEnumId()}" was expected to be "${field.getClassProto().getEnumId()}".`);
    }

    const enumValue = value.getValue();
    if (!isString(enumValue)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Enum's value "${value}" is not a string.`);
    }

    if (enumValue.length < 1 || enumValue.length > this.getMaxBytes()) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Must be between [1] and [${this.getMaxBytes()}] bytes, [${enumValue.length}] bytes given.`);
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
    if (value instanceof Enum) {
      return `${value.getValue()}`;
    }

    return null;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?Enum}
   *
   * @throws {DecodeValueFailed}
   */
  decode(value, field, codec = null) {
    if (value === null) {
      return null;
    }

    try {
      return field.getClassProto().create(value);
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
