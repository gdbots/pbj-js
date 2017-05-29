/* eslint-disable class-methods-use-this */

import AbstractBinaryType from './AbstractBinaryType';
import TypeName from '../Enum/TypeName';

/** @type MediumBlobType */
let instance = null;

export default class MediumBlobType extends AbstractBinaryType {
  constructor() {
    super(TypeName.MEDIUM_BLOB);
  }

  /**
   * @returns {MediumBlobType}
   */
  static create() {
    if (instance === null) {
      instance = new MediumBlobType();
    }

    return instance;
  }

  /**
   * @returns {number}
   */
  getMaxBytes() {
    return 16777215;
  }

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return false;
  }
}
