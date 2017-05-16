/* eslint-disable class-methods-use-this, no-unused-vars */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

class TinyIntType extends AbstractIntType {
  constructor() {
    super(TypeName.TINY_INT);
  }

  /**
   * @return {number}
   */
  getMin() {
    return 0;
  }

  /**
   * @return {number}
   */
  getMax() {
    return 255;
  }
}

const tinyIntType = new TinyIntType();
Object.freeze(tinyIntType);
export default tinyIntType;