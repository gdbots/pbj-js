import AbstractIntType from './AbstractIntType';
import TypeName from '../enums/TypeName';

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
