import deburr from 'lodash/deburr';
import trim from 'lodash/trim';
import isValidSlug from './isValidSlug';

// some punctuation and other chars are convertable
const convertables = [
  { s: "'", r: '' },
  { s: '"', r: '' },
  { s: '?', r: '' },
  { s: '#', r: '' },
  { s: '\\', r: '' },
  { s: '&amp;', r: ' And ' },
  { s: '&', r: ' And ' },
  { s: '%', r: ' Percent ' },
  { s: '@', r: ' At ' },
];

// does not surround digits with dashes like lodash does
function kebabCase(str) {
  return str
    .replace(/[\/-\s_]+/g, '-')
    .replace(/([a-z][A-Z])/, (m, p1) => `${p1[0]}-${p1[1].toLowerCase()}`)
    .replace(/(^-+)|(-+$)/g, '')
    .toLowerCase();
}

/**
 * Creates a slug cased string (aka kebab case) from the provided string if possible.
 * A null return means the input cannot be made into a slug.
 *
 * @param {string} str
 * @param {boolean} [allowSlashes]
 *
 * @returns {?string}
 */
export default function createSlug(str, allowSlashes = false) {
  let strFixed = trim(deburr(str));
  let result = null;

  if (!strFixed) {
    return result;
  }

  convertables.forEach(({ s, r = '' }) => {
    strFixed = strFixed.replace(s, r);
  });

  if (!allowSlashes) {
    strFixed = strFixed.replace(/[^a-zA-Z0-9\-/]+/g, '-');
    result = kebabCase(strFixed);

    return isValidSlug(result, false) ? result : null;
  }

  result = strFixed.replace(/[^a-zA-Z0-9\-/]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(\/-)|(-\/)/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^[-/]+|[-/]+$/g, '')
    .toLowerCase();

  return isValidSlug(result, true) ? result : null;
}
