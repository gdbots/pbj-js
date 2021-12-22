import AbstractStringType from './AbstractStringType.js';
import TypeName from '../enums/TypeName.js';

export default class MediumTextType extends AbstractStringType {
  constructor() {
    super(TypeName.MEDIUM_TEXT);
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
