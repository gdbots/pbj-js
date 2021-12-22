import endsWith from 'lodash-es/endsWith.js';
import startsWith from 'lodash-es/startsWith.js';
import trim from 'lodash-es/trim.js';

const VALID_SLUG_PATTERN = /^([a-z0-9]-?)*[a-z0-9]$/;
const VALID_DATED_SLUG_PATTERN = /^([a-z0-9-]|[a-z0-9-][a-z0-9-/]*[a-z0-9-])$/;

/**
 * Returns true if the provided value is a slug.
 *
 * @param {string} slug
 * @param {boolean} [allowSlashes]
 *
 * @returns {boolean}
 */
export default function isValidSlug(slug, allowSlashes = false) {
  if (!trim(slug)) {
    return false;
  }

  if (startsWith(slug, '-') || startsWith(slug, '/')) {
    return false;
  }

  if (endsWith(slug, '-') || endsWith(slug, '/')) {
    return false;
  }

  const regex = allowSlashes ? VALID_DATED_SLUG_PATTERN : VALID_SLUG_PATTERN;
  return regex.test(slug);
}
