import AbstractStringType from './AbstractStringType';
import TypeName from '../enums/TypeName';

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
