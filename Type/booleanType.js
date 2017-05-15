/* eslint-disable class-methods-use-this */

import isBoolean from 'lodash-es/isBoolean';
import Type from './Type';
import TypeName from '../Enum/TypeName';

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

    throw new Error(`Field [${field.getName()}] expected a boolean, got [${JSON.stringify(value)}].`);
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @return {boolean}
   */
  encode(value, field, codec = null) {
    // eslint-disable-line no-unused-vars
    return value;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @return {boolean}
   */
  decode(value, field, codec = null) {
    // eslint-disable-line no-unused-vars
    return value;
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