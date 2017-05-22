/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

/** @type MediumIntType */
let instance = null;

export default class MediumIntType extends AbstractIntType {
  constructor() {
    super(TypeName.MEDIUM_INT);
  }

  /**
   * @returns {MediumIntType}
   */
  static create() {
    if (instance === null) {
      instance = new MediumIntType();
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
    return 16777215;
  }
}
