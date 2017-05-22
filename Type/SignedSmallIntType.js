/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

/** @type SignedSmallIntType */
let instance = null;

export default class SignedSmallIntType extends AbstractIntType {
  constructor() {
    super(TypeName.SIGNED_SMALL_INT);
  }

  /**
   * @returns {SignedSmallIntType}
   */
  static create() {
    if (instance === null) {
      instance = new SignedSmallIntType();
    }

    return instance;
  }

  /**
   * @returns {number}
   */
  getMin() {
    return -32768;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 32767;
  }
}