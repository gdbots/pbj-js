import AbstractIntType from './AbstractIntType.js';
import TypeName from '../enums/TypeName.js';

export default class MediumIntType extends AbstractIntType {
  constructor() {
    super(TypeName.MEDIUM_INT);
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
    return 16777215;
  }
}
