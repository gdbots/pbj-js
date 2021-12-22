import trim from 'lodash-es/trim.js';
import trimStart from 'lodash-es/trimStart.js';

const DATE_PATTERN = /^\d{4}\/\d{2}\/\d{2}\/?(\S+)?/;

/**
 * Removes the date in the format YYYY/mm/dd from the slug if it is fou
 *
 * @param {string} slug
 *
 * @returns {?string}
 */
export default function removeDateToSlug(slug) {
  let s = trim(slug, '/');
  let match;

  while (DATE_PATTERN.test(s)) {
    match = s.match(DATE_PATTERN);
    s = trimStart(match[1] ? match[1] : '', '/');
  }

  return s;
}
