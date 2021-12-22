import trim from 'lodash-es/trim.js';
import createSlug from './createSlug.js';

/**
 * Creates a slug from a CamelCase string
 *
 * @param {string} str
 * @param {boolean} [allowSlashes]
 *
 * @returns {?string}
 */
export default function createSlugFromCamel(str, allowSlashes = false) {
  const s = trim(str).replace(/([A-Z])/g, ' $1');
  return createSlug(s, allowSlashes);
}
