/* eslint-disable class-methods-use-this, no-unused-vars */

import isBoolean from 'lodash-es/isBoolean';
import toLower from 'lodash-es/toLower';
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

    throw new AssertionFailed(`Field [${field.getName()}] expected a boolean, got [${JSON.stringify(value)}].`);
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @return {boolean}
   */
  encode(value, field, codec = null) {
    return !!value;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @return {boolean}
   */
  decode(value, field, codec = null) {
    if (isBoolean(value)) {
      return !!value;
    }

    return ['1', 'true', 'yes', 'on', '+'].indexOf(toLower(value)) !== -1;
  }

  /**
   * @return {boolean}
   */
  getDefault() {
    return false;
  }

  /**
   * @return {boolean}
   */
  isBoolean() {
    return true;
  }

  /**
   * @return {boolean}
   */
  allowedInSet() {
    return false;
  }
}

const booleanType = new BooleanType();
Object.freeze(booleanType);
export default booleanType;