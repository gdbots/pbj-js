/* eslint-disable */

import kebabCase from 'lodash/kebabCase';
import deburr from 'lodash/deburr';
import trim from 'lodash/trim';
import trimStart from 'lodash/trimStart';
import isValidHashtag from './isValidHashtag';

// some punctuation and other chars are convertable
const convertables = [
  { s: "'", r: '' },
  { s: '"', r: '' },
  { s: '?', r: '' },
  { s: '#', r: '' },
  { s: '/', r: '' },
  { s: '\\', r: '' },
  { s: '&amp;', r: ' And ' },
  { s: '&', r: ' And ' },
  { s: '%', r: ' Percent ' },
  { s: '@', r: ' At ' },
];

/**
 * Creates a slug cased string (aka kebab case) from the provided string if possible.
 * A null return means the input cannot be made into a slug.
 *
 * @param {string} str
 * @param {boolean} [allowSlashes]
 *
 * @return {?string}
 */
export default function createSlug(str, allowSlashes = false) {
  return kebabCase(str);
}
