/* eslint-disable class-methods-use-this */

import AbstractIntType from './AbstractIntType';
import TypeName from '../Enum/TypeName';

/** @type TinyIntType */
let instance = null;

export default class TinyIntType extends AbstractIntType {
  constructor() {
    super(TypeName.TINY_INT);
  }

  /**
   * @returns {TinyIntType}
   */
  static create() {
    if (instance === null) {
      instance = new TinyIntType();
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
    return 255;
  }
}
