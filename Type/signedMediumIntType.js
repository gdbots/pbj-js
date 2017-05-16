/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

class SignedMediumIntType extends AbstractIntType {
  constructor() {
    super(TypeName.SIGNED_MEDIUM_INT);
  }

  /**
   * @returns {number}
   */
  getMin() {
    return -8388608;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 8388607;
  }
}

const signedMediumIntType = new SignedMediumIntType();
Object.freeze(signedMediumIntType);
export default signedMediumIntType;