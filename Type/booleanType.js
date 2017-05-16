/* eslint-disable class-methods-use-this, no-unused-vars */

import isBoolean from 'lodash-es/isBoolean';
import toLower from 'lodash-es/toLower';
import trim from 'lodash-es/trim';
import Type from './Type';
import TypeName from '../Enum/TypeName';
import AssertionFailed from '../Exception/AssertionFailed';

class BooleanType extends Type {
  constructor() {
    super(TypeName.BOOLEAN);
  }

  /**
   * @param {*} value
   * @param {Field} field
   */
  guard(value, field) {
    if (isBoolean(value)) {
      return;
    }

    throw new AssertionFailed(`${field.getName()} :: Value "${JSON.stringify(value)}" is not a boolean.`);
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {boolean}
   */
  encode(value, field, codec = null) {
    return !!value;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
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

const booleanType = new BooleanType();
Object.freeze(booleanType);
export default booleanType;