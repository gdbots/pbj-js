import AbstractIntType from './AbstractIntType.js';
import TypeName from '../enums/TypeName.js';

export default class TinyIntType extends AbstractIntType {
  constructor() {
    super(TypeName.TINY_INT);
  }

  /**
   * @returns {number}
   */
  getMin() {
    return 0;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 255;
  }
}
