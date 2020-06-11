import AbstractIntType from './AbstractIntType';
import TypeName from '../enums/TypeName';

export default class SignedTinyIntType extends AbstractIntType {
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
