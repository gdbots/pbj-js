/* eslint-disable class-methods-use-this */

import AbstractStringType from './AbstractStringType';
import TypeName from '../Enum/TypeName';

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