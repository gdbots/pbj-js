import AbstractBinaryType from './AbstractBinaryType';
import TypeName from '../enums/TypeName';

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
