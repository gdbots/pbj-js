/* eslint-disable class-methods-use-this, max-len, no-unused-vars, no-useless-escape */

import isValidEmail from '@gdbots/common/isValidEmail';
import isValidHashtag from '@gdbots/common/isValidHashtag';
import isValidHostname from '@gdbots/common/isValidHostname';
import isValidIpv4 from '@gdbots/common/isValidIpv4';
import isValidIpv6 from '@gdbots/common/isValidIpv6';
import isValidISO8601Date from '@gdbots/common/isValidISO8601Date';
import isValidUri from '@gdbots/common/isValidUri';
import isValidUrl from '@gdbots/common/isValidUrl';
import clamp from 'lodash/clamp';
import isString from 'lodash/isString';
import trim from 'lodash/trim';
import AssertionFailed from '../exceptions/AssertionFailed';
import Format from '../enums/Format';
import Type from './Type';

export default class AbstractStringType extends Type {
  /**
   * @param {*} value
   * @param {Field} field
   *
   * @throws {AssertionFailed}
   */
  guard(value, field) {
    if (!isString(value)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value [${JSON.stringify(value)}] is not a string.`);
    }

    // fixme: deal with browsers not having "Buffer" available
    // we must get BYTES, not characters ಠ_ಠ
    const strLength = Buffer.from(value).byteLength;
    const minLength = field.getMinLength();
    const maxLength = clamp(field.getMaxLength(), minLength, this.getMaxBytes());

    if (strLength < minLength || strLength > maxLength) {
      throw new AssertionFailed(
        `Field [${field.getName()}] :: Must be between [${minLength}] and [${maxLength}] bytes, [${strLength}] bytes given.`,
      );
    }

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
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?string}
   */
  encode(value, field, codec = null) {
    const trimmed = trim(value);
    return trimmed === '' ? null : trimmed;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @returns {?string}
   */
  decode(value, field, codec = null) {
    const trimmed = trim(value);
    return trimmed === '' ? null : trimmed;
  }

  /**
   * @returns {boolean}
   */
  isString() {
    return true;
  }
}
