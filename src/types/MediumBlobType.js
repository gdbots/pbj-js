import AbstractBinaryType from './AbstractBinaryType.js';
import TypeName from '../enums/TypeName.js';

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
