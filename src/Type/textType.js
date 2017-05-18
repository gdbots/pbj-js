/* eslint-disable class-methods-use-this */

import AbstractStringType from './AbstractStringType';
import TypeName from '../Enum/TypeName';

class TextType extends AbstractStringType {
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

const instance = new TextType();
export default instance;
