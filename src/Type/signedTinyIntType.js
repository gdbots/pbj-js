/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

class SignedTinyIntType extends AbstractIntType {
  constructor() {
    super(TypeName.SIGNED_TINY_INT);
  }

  /**
   * @returns {number}
   */
  getMin() {
    return -128;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 127;
  }
}

const instance = new SignedTinyIntType();
Object.freeze(instance);
export default instance;
