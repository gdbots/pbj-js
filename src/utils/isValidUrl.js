import startsWith from 'lodash/startsWith';
import trimStart from 'lodash/trimStart';
import isValidEmail from './isValidEmail';
import isValidIpv6 from './isValidIpv6';

/**
 * inspired by gist @link https://gist.github.com/dperini/729294
 * and @link http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without
 * - no unicode allowed
 * - allow mailto protocol
 * - what is a url?
 * - scheme://username:password@subdomain.domain.tld:port/path/file-name.suffix?query-string#hash
 */
function genericUrlRegex() {
  const protocol = '(?:(?:https?|ftp)://)'; // (?:([A-Za-z]{3,9}://)|mailto:)
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

const GENERIC_URL_REGEX = genericUrlRegex();

/**
 * Returns true if the provided value is a url.
 *
 * @param {string} url
 * @returns {boolean}
 */
export default function isValidUrl(url) {
  if (!url || !url.trim()) {
    return false;
  }

  // generic url, only allow 'http', 'https' and 'ftp' for now
  if (GENERIC_URL_REGEX.test(url)) {
    return true;
  }

  // email url
  if (startsWith(url, 'mailto:') && isValidEmail(trimStart(url, 'mailto:'))) {
    return true;
  }

  // cover corner cases for ipv6 in url
  // ipv4 has already included in generic regex
  const testIpv6 = url.match(/(?:https?|ftp):\/\/\[(.+)\](\S*)/i);
  return !!testIpv6 && isValidIpv6(testIpv6[1]);
}
