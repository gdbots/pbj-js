/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

/** @type {SmallIntType} */
let instance = null;

export default class SmallIntType extends AbstractIntType {
  constructor() {
    super(TypeName.SMALL_INT);
  }

  /**
   * @returns {SmallIntType}
   */
  static create() {
    if (instance === null) {
      instance = new SmallIntType();
    }

    return instance;
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
