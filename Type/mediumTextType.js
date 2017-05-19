/* eslint-disable class-methods-use-this */

import AbstractStringType from './AbstractStringType';
import TypeName from '../Enum/TypeName';

class MediumTextType extends AbstractStringType {
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

const instance = new MediumTextType();
export default instance;