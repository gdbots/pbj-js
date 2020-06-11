import toSafeInteger from 'lodash/toSafeInteger';

/**
 * October 15, 1582 UTC
 * @const int
 */
const MIN_UTC_TIME = -12219292800;

/**
 * Returns true if it's a valid timestamp.
 *
 * @param {string} timestamp
 * @param {boolean} [allowNegative]
 *
 * @returns {boolean}
 */
export default function isValidTimestamp(timestamp, allowNegative = false) {
  const timestampStr = `${timestamp}`;
  const timestampInt = toSafeInteger(timestamp);

  if (allowNegative) {
    return (`${timestampInt}` === timestampStr)
      && (timestampInt <= toSafeInteger(Number.MAX_VALUE))
      && (timestampInt >= MIN_UTC_TIME);
  }

  return (`${timestampInt}` === timestampStr)
    && (timestampInt <= toSafeInteger(Number.MAX_VALUE))
    && (timestampInt >= 0);
}
