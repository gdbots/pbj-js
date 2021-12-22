import isValidIpv4 from './isValidIpv4.js';
import isValidIpv6 from './isValidIpv6.js';

const GENERIC_EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;

/**
 * Returns true if the provided value is a email address.
 *
 * @param {string} email
 *
 * @returns {boolean}
 */
export default function isValidEmail(email) {
  if (!email || !email.trim()) {
    return false;
  }

  const regex = /(\w+)@\[(.+)\]/i;
  const m = email.match(regex);
  if (m && m[1] && m[2]) {
    return isValidIpv4(m[2]) || isValidIpv6(m[2]);
  }

  return GENERIC_EMAIL_PATTERN.test(email);
}
