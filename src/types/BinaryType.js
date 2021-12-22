import AbstractBinaryType from './AbstractBinaryType.js';
import TypeName from '../enums/TypeName.js';

export default class BinaryType extends AbstractBinaryType {
  constructor() {
    super(TypeName.BINARY);
  }

  /**
   * @returns {number}
   */
  getMaxBytes() {
    return 255;
  }
}
