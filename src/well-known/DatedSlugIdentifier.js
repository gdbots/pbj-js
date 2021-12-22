import addDateToSlug from '../utils/addDateToSlug.js';
import createSlug from '../utils/createSlug.js';
import isValidSlug from '../utils/isValidSlug.js';
import slugContainsDate from '../utils/slugContainsDate.js';
import AssertionFailed from '../exceptions/AssertionFailed.js';
import Identifier from './Identifier.js';

export default class DatedSlugIdentifier extends Identifier {
  /**
   * @param {string} value
   */
  constructor(value) {
    super(value);

    if (!isValidSlug(this.value, true) || !slugContainsDate(this.value)) {
      throw new AssertionFailed(`Value "${this.value}" is not a valid dated slug.`);
    }

    Object.freeze(this);
  }

  /**
   * @param {string} str
   * @param {?Date}  [date]
   *
   * @returns {DatedSlugIdentifier}
   */
  static create(str, date = null) {
    const slug = createSlug(str, true);

    if (slugContainsDate(slug)) {
      return new this(slug);
    }

    return new this(addDateToSlug(slug, date));
  }
}
