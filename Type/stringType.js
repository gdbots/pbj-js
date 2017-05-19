/* eslint-disable class-methods-use-this, no-unused-vars, max-len, comma-dangle */

import trim from 'lodash-es/trim';
import isValidHashtag from '@gdbots/common/isValidHashtag';
import AbstractStringType from './AbstractStringType';
import Format from '../Enum/Format';
import TypeName from '../Enum/TypeName';
import AssertionFailed from '../Exception/AssertionFailed';

class StringType extends AbstractStringType {
  constructor() {
    super(TypeName.STRING);
  }

  /**
   * @param {*} value
   * @param {Field} field
   */
  guard(value, field) {
    super.guard(value, field);

    if (field.getPattern() && !field.getPattern().test(value)) {
      throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" does not match expression "${field.getPattern()}".`);
    }

    switch (field.getFormat()) {
      case Format.UNKNOWN:
        break;

      case Format.HASHTAG:
        if (!isValidHashtag(value)) {
          throw new AssertionFailed(`Field [${field.getName()}] :: Value "${value}" is not a valid hashtag.`);
        }

        break;

      default:
        break;
    }

    // todo: convert below (from pbj-php) to es6
    //
    // switch ($field->getFormat()->getValue()) {
    //
    //     case Format::DATE:
    //         Assertion::regex($value, '/^\d{4}-\d{2}-\d{2}$/', null, $field->getName());
    //         break;
    //
    //     case Format::DATE_TIME:
    //         Assertion::true(
    //             DateUtils::isValidISO8601Date($value),
    //             sprintf(
    //                 'Field [%s] must be a valid ISO8601 date-time.  Format must match one of [%s], [%s] or [%s].',
    //                 $field->getName(),
    //                 DateUtils::ISO8601_ZULU,
    //                 DateUtils::ISO8601,
    //                 \DateTime::ISO8601
    //             ),
    //             $field->getName()
    //         );
    //         break;
    //
    //     case Format::SLUG:
    //         Assertion::regex($value, '/^([\w\/-]|[\w-][\w\/-]*[\w-])$/', null, $field->getName());
    //         break;
    //
    //     case Format::EMAIL:
    //         Assertion::email($value, null, $field->getName());
    //         break;
    //
    //     case Format::HASHTAG:
    //         Assertion::true(
    //             HashtagUtils::isValid($value),
    //             sprintf('Field [%s] must be a valid hashtag.  @see HashtagUtils::isValid', $field->getName()),
    //             $field->getName()
    //         );
    //         break;
    //
    //     case Format::IPV4:
    //     case Format::IPV6:
    //         /*
    //          * todo: need separate assertion for ipv4 and ipv6
    //          */
    //         Assertion::url(
    //             'http://' . $value,
    //             sprintf(
    //                 'Field [%s] must be a valid [%s].',
    //                 $field->getName(),
    //                 $field->getFormat()->getValue()
    //             ),
    //             $field->getName()
    //         );
    //         break;
    //
    //     case Format::HOSTNAME:
    //     case Format::URI:
    //     case Format::URL:
    //         /*
    //          * fixme: need better handling for HOSTNAME, URI and URL... assertion library just has one "url" handling
    //          * but we really need separate ones for each of these formats.  right now we're just prefixing
    //          * the value with a http so it looks like a url.  this won't work for thinks like mailto:
    //          * urn:, etc.
    //          */
    //         if (false === strpos($value, 'http')) {
    //             $value = 'http://' . $value;
    //         }
    //
    //         Assertion::url(
    //             $value,
    //             sprintf(
    //                 'Field [%s] must be a valid [%s].',
    //                 $field->getName(),
    //                 $field->getFormat()->getValue()
    //             ),
    //             $field->getName()
    //         );
    //         break;
    //
    //     case Format::UUID:
    //         Assertion::uuid($value, null, $field->getName());
    //         break;
    //
    //     default:
    //         break;
    // }
  }

  /**
   * @returns {number}
   */
  getMaxBytes() {
    return 255;
  }
}

const instance = new StringType();
export default instance;