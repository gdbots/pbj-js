import AbstractIntType from './AbstractIntType.js';
import TypeName from '../enums/TypeName.js';

export default class SmallIntType extends AbstractIntType {
  constructor() {
    super(TypeName.SMALL_INT);
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
    return 65535;
  }
}
