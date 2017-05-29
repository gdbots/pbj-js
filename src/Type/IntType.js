/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

/** @type IntType */
let instance = null;

export default class IntType extends AbstractIntType {
  constructor() {
    super(TypeName.INT);
  }

  /**
   * @returns {IntType}
   */
  static create() {
    if (instance === null) {
      instance = new IntType();
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
    return 4294967295;
  }
}
