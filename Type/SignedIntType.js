/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

/** @type {SignedIntType} */
let instance = null;

export default class SignedIntType extends AbstractIntType {
  constructor() {
    super(TypeName.SIGNED_INT);
  }

  /**
   * @returns {SignedIntType}
   */
  static create() {
    if (instance === null) {
      instance = new SignedIntType();
    }

    return instance;
  }

  /**
   * @returns {number}
   */
  getMin() {
    return -2147483648;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 2147483647;
  }
}