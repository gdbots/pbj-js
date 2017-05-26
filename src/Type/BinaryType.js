/* eslint-disable class-methods-use-this */

import AbstractBinaryType from './AbstractBinaryType';
import TypeName from '../Enum/TypeName';

/** @type BinaryType */
let instance = null;

export default class BinaryType extends AbstractBinaryType {
  constructor() {
    super(TypeName.BINARY);
  }

  /**
   * @returns {BinaryType}
   */
  static create() {
    if (instance === null) {
      instance = new BinaryType();
    }

    return instance;
  }

  /**
   * @returns {number}
   */
  getMaxBytes() {
    return 255;
  }
}
