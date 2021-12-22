import AbstractIntType from './AbstractIntType.js';
import TypeName from '../enums/TypeName.js';

export default class IntType extends AbstractIntType {
  constructor() {
    super(TypeName.INT);
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
    return 4294967295;
  }
}
