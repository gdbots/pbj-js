/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

class SignedIntType extends AbstractIntType {
  constructor() {
    super(TypeName.SIGNED_INT);
  }

  /**
   * @returns {number}
   */
  getMin() {
    return -2147483648;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 2147483647;
  }
}

const instance = new SignedIntType();
export default instance;
