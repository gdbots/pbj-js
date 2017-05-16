/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

class TinyIntType extends AbstractIntType {
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

const tinyIntType = new TinyIntType();
Object.freeze(tinyIntType);
export default tinyIntType;