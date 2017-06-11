/* eslint-disable class-methods-use-this */

import AbstractBinaryType from './AbstractBinaryType';
import TypeName from '../Enum/TypeName';

/** @type {BlobType} */
let instance = null;

export default class BlobType extends AbstractBinaryType {
  constructor() {
    super(TypeName.BLOB);
  }

  /**
   * @returns {BlobType}
   */
  static create() {
    if (instance === null) {
      instance = new BlobType();
    }

    return instance;
  }

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return false;
  }
}
