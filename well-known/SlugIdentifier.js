import createSlug from '@gdbots/common/createSlug';
import isValidSlug from '@gdbots/common/isValidSlug';
import AssertionFailed from '../exceptions/AssertionFailed';
import Identifier from './Identifier';

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