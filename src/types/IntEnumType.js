import Enum from '../Enum';
import isSafeInteger from 'lodash/isSafeInteger';
import toSafeInteger from 'lodash/toSafeInteger';
import Type from './Type';
import TypeName from '../enums/TypeName';
import AssertionFailed from '../exceptions/AssertionFailed';
import DecodeValueFailed from '../exceptions/DecodeValueFailed';

export default class IntEnumType extends Type {
  constructor() {
    super(TypeName.INT_ENUM);
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!(value instanceof Enum)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] was expected to be an Enum.`);
    }

    if (value.getEnumId() !== field.getClassProto().getEnumId()) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value.getEnumId()}" was expected to be "${field.getClassProto().getEnumId()}".`);
    }

    const enumValue = value.getValue();
    if (!isSafeInteger(enumValue)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Enum's value "${value}" is not an integer.`);
    }

    if (enumValue < this.getMin() || enumValue > this.getMax()) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Enum's value "${enumValue}" was expected to be at least "${this.getMin()}" and at most "${this.getMax()}".`);
    }
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {number}
   */
  encode(value, field, codec = null) {
    if (value instanceof Enum) {
      return toSafeInteger(value.getValue());
    }

    return 0;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
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
  isNumeric() {
    return true;
  }

  /**
   * @returns {number}
   */
  getMin() {
    return 0;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 65535;
  }
}
