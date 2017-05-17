/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

class SmallIntType extends AbstractIntType {
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

const instance = new SmallIntType();
export default instance;
