import AbstractIntType from './AbstractIntType.js';
import TypeName from '../enums/TypeName.js';

export default class SignedSmallIntType extends AbstractIntType {
  constructor() {
    super(TypeName.SIGNED_SMALL_INT);
  }

  /**
   * @returns {number}
   */
  getMin() {
    return -32768;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 32767;
  }
}
