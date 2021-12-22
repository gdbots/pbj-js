import AbstractStringType from './AbstractStringType.js';
import TypeName from '../enums/TypeName.js';

export default class TextType extends AbstractStringType {
  constructor() {
    super(TypeName.TEXT);
  }

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return false;
  }
}
