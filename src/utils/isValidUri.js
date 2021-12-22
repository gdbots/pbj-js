import startsWith from 'lodash-es/startsWith.js';
import trimStart from 'lodash-es/trimStart.js';
import isValidEmail from './isValidEmail.js';
import isValidIpv6 from './isValidIpv6.js';
import isValidUrn from './isValidUrn.js';

const GENERIC_URI_PATTERN = /^(?:[a-z0-9][a-z0-9-]{1,31}:(?:[a-z0-9()+,-.:=@;$_!*']|%(?:2[1-9a-f]|[3-6][0-9a-f]|7[0-9a-e]))+)$/i;

/**
 * Compose a url style uri regex
 *
 * The most common form of URI is the Uniform Resource Locator (URL),
 * frequently referred to informally as a web address. More rarely seen in usage
 * is the Uniform Resource Name (URN), which was designed to complement URLs by
 * providing a mechanism for the identification of resources in particular
 * namespaces.
 * - scheme:[//[user[:password]@]host[:port]][/path][?query][#fragment]
 * - https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
function urlStyleUriRegex() {
  const protocol = '(?:[A-Za-z]{3,9}://)';
  const auth = '(?:\\S+(?::\\S*)?@)?';
  const ipv4 = '(?:\\[?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\]?';
  const host = '(?:(?:[a-zA-Z0-9]-*)*[a-zA-Z0-9]+)';
  const domain = '(?:\\.(?:[a-zA-Z0-9]-*)*[a-zA-Z0-9]+)*';
  const tld = '(?:\\.(?:[a-zA-Z]{2,}))\\.?';
  const port = '(?::\\d{2,5})?';
  const path = '(?:[/?#][\\x21-\\x7F]*)?'; // ascii no whitespaces
  const regex = `(?:${protocol}|www\\.)${auth}(?:localhost|${ipv4}|${host}${domain}${tld})${port}${path}`;

  return new RegExp(`^${regex}$`, 'i');
}

const URL_STYLE_URI_REGEX = urlStyleUriRegex();

/**
 * Returns true if the provided value is a uri.
 *
 * @param {string} uri
 *
 * @returns {boolean}
 */
export default function isValidUri(uri) {
  // url style uri, the scheme are not only limit to http, https, ftp
  if (URL_STYLE_URI_REGEX.test(uri) || isValidUrn(uri) || GENERIC_URI_PATTERN.test(uri)) {
    return true;
  }

  // mailto protocol uri
  if (startsWith(uri, 'mailto:') && isValidEmail(trimStart(uri, 'mailto:'))) {
    return true;
  }

  // ipv6 in uri
  const testIpv6 = uri.match(/(\w+):\/\/\[(.+)\](\S*)/i);
  return !!testIpv6 && !!testIpv6[1] && isValidIpv6(testIpv6[2]);
}
