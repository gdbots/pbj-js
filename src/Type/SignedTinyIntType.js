/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

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
