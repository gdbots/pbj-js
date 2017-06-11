/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

/** @type {SignedTinyIntType} */
let instance = null;

export default class SignedTinyIntType extends AbstractIntType {
  constructor() {
    super(TypeName.SIGNED_TINY_INT);
  }

  /**
   * @returns {SignedTinyIntType}
   */
  static create() {
    if (instance === null) {
      instance = new SignedTinyIntType();
    }

    return instance;
  }

  /**
   * @returns {number}
   */
  getMin() {
    return -128;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 127;
  }
}