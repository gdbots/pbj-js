/* eslint-disable class-methods-use-this */

import AbstractStringType from './AbstractStringType';
import TypeName from '../Enum/TypeName';

/** @type {TextType} */
let instance = null;

export default class TextType extends AbstractStringType {
  constructor() {
    super(TypeName.TEXT);
  }

  /**
   * @returns {TextType}
   */
  static create() {
    if (instance === null) {
      instance = new TextType();
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