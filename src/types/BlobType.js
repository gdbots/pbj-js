import AbstractBinaryType from './AbstractBinaryType.js';
import TypeName from '../enums/TypeName.js';

export default class BlobType extends AbstractBinaryType {
  constructor() {
    super(TypeName.BLOB);
  }

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return false;
  }
}
