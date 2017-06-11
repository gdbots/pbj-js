/* eslint-disable class-methods-use-this, no-unused-vars, max-len, no-useless-escape */

import isValidEmail from '@gdbots/common/isValidEmail';
import isValidHashtag from '@gdbots/common/isValidHashtag';
import isValidISO8601Date from '@gdbots/common/isValidISO8601Date';
import isValidHostname from '@gdbots/common/isValidHostname';
import isValidIpv4 from '@gdbots/common/isValidIpv4';
import isValidIpv6 from '@gdbots/common/isValidIpv6';
import isValidUri from '@gdbots/common/isValidUri';
import isValidUrl from '@gdbots/common/isValidUrl';
import AbstractStringType from './AbstractStringType';
import Format from '../Enum/Format';
import TypeName from '../Enum/TypeName';
import AssertionFailed from '../Exception/AssertionFailed';

/** @type {StringType} */
let instance = null;

export default class StringType extends AbstractStringType {
  constructor() {
    super(TypeName.STRING);
  }

  /**
   * @returns {StringType}
   */
  static create() {
    if (instance === null) {
      instance = new StringType();
    }

    return instance;
  }

  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    super.guard(value, field);

    if (field.getPattern() && !field.getPattern().test(value)) {
      throw new AssertionFailed(
        `Field [${field.getName()}] :: Value "${value}" does not match expression "${field.getPattern()}".`,
      );
    }

    switch (field.getFormat()) {
      case Format.UNKNOWN:
        break;

      case Format.DATE:
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          throw new AssertionFailed(
            `Field [${field.getName()}] :: Value "${value}" is not a valid date with format "YYYY-MM-DD".`,
          );
        }

        break;

      case Format.DATE_TIME:
        if (!isValidISO8601Date(value)) {
          throw new AssertionFailed(
            `Field [${field.getName()}] :: Value "${value}" is not a valid ISO8601 date/time.  E.g. "2017-05-25T02:54:18Z".`,
          );
        }

        break;

      case Format.SLUG:
        // note that this format is less restrictive than "isValidSlug" function from @gdbots/common.
        // This is intentional as not everyone is as strict with slug formats.  for example, youtube
        // "slugs" contain both upper and lower case characters and underscores and hyphens.
        if (!/^([\w\/-]|[\w-][\w\/-]*[\w-])$/.test(value)) {
          throw new AssertionFailed(
            `Field [${field.getName()}] :: Value "${value}" is not a valid slug.`,
          );
        }

        break;

      case Format.EMAIL:
        if (!isValidEmail(value)) {
          throw new AssertionFailed(
            `Field [${field.getName()}] :: Value "${value}" is not a valid email address.`,
          );
        }

        break;

      case Format.HASHTAG:
        if (!isValidHashtag(value)) {
          throw new AssertionFailed(
            `Field [${field.getName()}] :: Value "${value}" is not a valid hashtag.`,
          );
        }

        break;

      case Format.IPV4:
        if (!isValidIpv4(value)) {
          throw new AssertionFailed(
            `Field [${field.getName()}] :: Value "${value}" is not a valid IPv4 address.`,
          );
        }

        break;

      case Format.IPV6:
        if (!isValidIpv6(value)) {
          throw new AssertionFailed(
            `Field [${field.getName()}] :: Value "${value}" is not a valid IPv6 address.`,
          );
        }

        break;

      case Format.HOSTNAME:
        if (!isValidHostname(value)) {
          throw new AssertionFailed(
            `Field [${field.getName()}] :: Value "${value}" is not a valid HOSTNAME.`,
          );
        }

        break;

      case Format.URI:
        if (!isValidUri(value)) {
          throw new AssertionFailed(
            `Field [${field.getName()}] :: Value "${value}" is not a valid URI.`,
          );
        }

        break;

      case Format.URL:
        if (!isValidUrl(value)) {
          throw new AssertionFailed(
            `Field [${field.getName()}] :: Value "${value}" is not a valid URL.`,
          );
        }

        break;

      case Format.UUID:
        if (!/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/.test(value)) {
          throw new AssertionFailed(
            `Field [${field.getName()}] :: Value "${value}" is not a valid UUID.`,
          );
        }

        break;

      default:
        break;
    }
  }

  /**
   * @returns {number}
   */
  getMaxBytes() {
    return 255;
  }
}
