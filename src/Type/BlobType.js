/* eslint-disable class-methods-use-this */

import AbstractBinaryType from './AbstractBinaryType';
import TypeName from '../Enum/TypeName';

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
