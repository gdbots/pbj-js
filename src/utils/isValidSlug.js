import endsWith from 'lodash/endsWith';
import startsWith from 'lodash/startsWith';
import trim from 'lodash/trim';

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
