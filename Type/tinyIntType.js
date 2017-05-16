/* eslint-disable class-methods-use-this, no-unused-vars */

import Type from './Type';
import TypeName from '../Enum/TypeName';

class TinyIntType extends Type {
  constructor() {
    super(TypeName.TINY_INT);
  }

  /**
   * @param {*} value
   * @param {Field} field
   */
  guard(value, field) {} // eslint-disable-line no-unused-vars


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
  allowedInSet() {
    return false;
  }
}

const tinyIntType = new TinyIntType();
Object.freeze(tinyIntType);
export default tinyIntType;