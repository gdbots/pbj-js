import trimStart from 'lodash/trimStart';

const DATE_PATTERN = /^\d{4}\/\d{2}\/\d{2}\/?(\S+)?/;

/**
 * Detemines if the slug contains a date in the format YYYY/mm/dd
 *
 * @param {string} slug
 *
 * @returns {boolean}
 */
export default function slugContainsDate(slug) {
  return DATE_PATTERN.test(trimStart(slug));
}
