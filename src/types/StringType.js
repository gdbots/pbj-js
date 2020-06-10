import AbstractStringType from './AbstractStringType';
import TypeName from '../enums/TypeName';

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
