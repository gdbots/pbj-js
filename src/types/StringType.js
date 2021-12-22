import AbstractStringType from './AbstractStringType.js';
import TypeName from '../enums/TypeName.js';

export default class StringType extends AbstractStringType {
  constructor() {
    super(TypeName.STRING);
  }

  /**
   * @returns {number}
   */
  getMaxBytes() {
    return 255;
  }
}
