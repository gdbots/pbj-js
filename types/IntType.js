/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../enums/TypeName';

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