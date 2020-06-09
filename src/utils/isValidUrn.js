const URN_PATTERN = /^(?:urn:(?!urn:)[a-z0-9][a-z0-9-]{1,31}:(?:[a-z0-9()+,-.:=@;$_!*']|%(?:2[1-9a-f]|[3-6][0-9a-f]|7[0-9a-e]))+)$/i;

/**
 * Returns true if the provided value is a urn.
 * https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 *
 * @param {string} urn
 *
 * @returns {boolean}
 */
export default function isValidUrn(urn) {
  return URN_PATTERN.test(urn);
}
