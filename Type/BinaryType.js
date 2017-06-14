/* eslint-disable class-methods-use-this */

import AbstractBinaryType from './AbstractBinaryType';
import TypeName from '../Enum/TypeName';

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