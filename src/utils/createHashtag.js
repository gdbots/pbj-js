import capitalize from 'lodash-es/capitalize.js';
import deburr from 'lodash-es/deburr.js';
import trim from 'lodash-es/trim.js';
import trimStart from 'lodash-es/trimStart.js';
import isValidHashtag from './isValidHashtag.js';

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
 * Creates a hashtag from the provided string if possible.
 * A null return means the input cannot be made into a hashtag.
 *
 * @param {string} str
 * @param {boolean} [camelize]
 *
 * @returns {?string}
 */
export default function createHashtag(str, camelize = true) {
  if (isValidHashtag(str)) {
    return trimStart(str, '#');
  }

  let hashtag = trim(str, '#_ ');
  convertables.forEach(({ s, r }) => {
    hashtag = hashtag.split(s).join(r);
  });

  hashtag = deburr(hashtag);
  hashtag = hashtag.replace(/[^a-zA-Z0-9_]/g, ' ');

  if (camelize) {
    hashtag = hashtag.split(' ').map(capitalize).join(' ');
  }

  hashtag = hashtag.replace(/\s/g, '');

  return isValidHashtag(hashtag) ? hashtag : null;
}
