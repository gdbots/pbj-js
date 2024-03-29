import createSlug from '../utils/createSlug.js';
import isValidSlug from '../utils/isValidSlug.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';
import Identifier from './Identifier.js';

export default class SlugIdentifier extends Identifier {
  /**
   * @param {string} value
   */
  constructor(value) {
    super(value);

    if (!isValidSlug(this.value)) {
      throw new AssertionFailed(`Value "${this.value}" is not a valid slug.`);
    }

    Object.freeze(this);
  }

  /**
   * @param {string} str
   *
   * @returns {SlugIdentifier}
   */
  static create(str) {
    return new this(createSlug(str));
  }
}
