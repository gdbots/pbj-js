/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

/** @type SignedMediumIntType */
let instance = null;

export default class SignedMediumIntType extends AbstractIntType {
  constructor() {
    super(TypeName.SIGNED_MEDIUM_INT);
  }

  /**
   * @returns {SignedMediumIntType}
   */
  static create() {
    if (instance === null) {
      instance = new SignedMediumIntType();
    }

    return instance;
  }

  /**
   * @returns {number}
   */
  getMin() {
    return -8388608;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 8388607;
  }
}
