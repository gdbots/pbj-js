import AbstractStringType from './AbstractStringType';
import TypeName from '../enums/TypeName';

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
