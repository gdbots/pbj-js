const IPV4_PATTERN = /^(?:([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

/**
 * Returns true if the provided value is a ipv4 address.
 *
 * @param {string} ipv4
 *
 * @returns {boolean}
 */
export default function isValidIpv4(ipv4) {
  return IPV4_PATTERN.test(ipv4);
}
