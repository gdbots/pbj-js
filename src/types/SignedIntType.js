import AbstractIntType from './AbstractIntType';
import TypeName from '../enums/TypeName';

export default class SignedIntType extends AbstractIntType {
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
