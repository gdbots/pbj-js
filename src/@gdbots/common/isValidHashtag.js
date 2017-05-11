import trimStart from 'lodash/trimStart';

/**
 * Returns true if the provided value is a hashtag.
 *
 * - must be alpha numeric (Current version does NOT support international hashtags.)
 * - must have at least one letter
 * - cannot start with an underscore
 * - cannot be greater than 139 characters
 *
 * @link http://twitter.pbworks.com/w/page/1779812/Hashtags
 *
 * @param {string} hashtag
 *
 * @return {boolean}
 */
export default function isValidHashtag(hashtag) {
  const trimmed = trimStart(hashtag, '#');

  if (trimmed === '') {
    return false;
  }

  const sanitized = trimmed.replace(/[^a-zA-Z0-9_]/, '');
  if (sanitized !== trimmed) {
    return false;
  }

  if (trimmed[0] === '_') {
    return false;
  }

  if (trimmed.length > 139) {
    return false;
  }

  return /[a-zA-Z]+/.test(trimmed);
}
