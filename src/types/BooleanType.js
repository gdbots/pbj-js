import isBoolean from 'lodash-es/isBoolean.js';
import toLower from 'lodash-es/toLower.js';
import trim from 'lodash-es/trim.js';
import Type from './Type.js';
import TypeName from '../enums/TypeName.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';

export default class BooleanType extends Type {
  constructor() {
    super(TypeName.BOOLEAN);
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (isBoolean(value)) {
      return;
    }

    throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] is not a boolean.`);
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {boolean}
   */
  encode(value, field, codec = null) {
    return !!value;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Object} [codec]
   *
   * @returns {boolean}
   */
  decode(value, field, codec = null) {
    if (isBoolean(value)) {
      return !!value;
    }

    return ['1', 'true', 'yes', 'on', '+'].indexOf(trim(toLower(value))) !== -1;
  }

  /**
   * @returns {boolean}
   */
  getDefault() {
    return false;
  }

  /**
   * @returns {boolean}
   */
  isBoolean() {
    return true;
  }

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return false;
  }
}
