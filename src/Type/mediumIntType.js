/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

class MediumIntType extends AbstractIntType {
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

const instance = new MediumIntType();
Object.freeze(instance);
export default instance;
