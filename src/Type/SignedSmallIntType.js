/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

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
