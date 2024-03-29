import trim from 'lodash-es/trim.js';
import trimStart from 'lodash-es/trimStart.js';
import isValidHashtag from './isValidHashtag.js';

/**
 * Extracts all of the valid hashtags from a string.
 * multi-line strings will work with this method.
 *
 * @param {string} str
 *
 * @returns {string[]} - Unique array of hashtags without the "#"
 */
export default function extractHashtags(str) {
  const hashtags = new Map();
  str.match(/[\s\S]#([a-z0-9_-]*)/gi)
    .map(s => trimStart(trim(s), '#_'))
    .filter(s => isValidHashtag(s))
    .map(hashtag => hashtags.set(hashtag.toLowerCase(), hashtag));

  return Array.from(hashtags.values());
}
