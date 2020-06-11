import AbstractBinaryType from './AbstractBinaryType';
import TypeName from '../enums/TypeName';

export default class MediumBlobType extends AbstractBinaryType {
  constructor() {
    super(TypeName.MEDIUM_BLOB);
  }

  /**
   * @returns {number}
   */
  getMaxBytes() {
    return 16777215;
  }

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return false;
  }
}
