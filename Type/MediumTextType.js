/* eslint-disable class-methods-use-this */

import AbstractStringType from './AbstractStringType';
import TypeName from '../Enum/TypeName';

/** @type {MediumTextType} */
let instance = null;

export default class MediumTextType extends AbstractStringType {
  constructor() {
    super(TypeName.MEDIUM_TEXT);
  }

  /**
   * @returns {MediumTextType}
   */
  static create() {
    if (instance === null) {
      instance = new MediumTextType();
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