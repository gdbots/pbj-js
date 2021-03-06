import AbstractIntType from './AbstractIntType';
import TypeName from '../enums/TypeName';

export default class SignedMediumIntType extends AbstractIntType {
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
