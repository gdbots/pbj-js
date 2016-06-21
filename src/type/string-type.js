'use strict';

import {default as DateUtils, ISO8601_ZULU, ISO8601} from 'gdbots/common/util/date-utils';
import HashtagUtils from 'gdbots/common/util/hashtag-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import AbstractStringType from 'gdbots/pbj/type/abstract-string-type';
import Format from 'gdbots/pbj/enum/format';

export default class StringType extends SystemUtils.mixinClass(AbstractStringType)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    super.guard(value, field);

    let pattern = field.getPattern();
    if (pattern && !pattern.test(value)) {
      throw new Error('Value [' + value + '] is invalid. It must match the pattern [' + pattern + '].');
    }

    switch (field.getFormat()) {
      case Format.UNKNOWN:
        break;

      case Format.DATE:
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          throw new Error('Field [' + field.getName() + '] must be a valid [' + field.getFormat().getValue() + '].');
        }

        break;

      case Format.DATE_TIME:
        if (!DateUtils.isValidISO8601Date(value)) {
          throw new Error('Field [' + field.getName() + '] must be a valid ISO8601 date-time. Format must match one of [' + ISO8601_ZULU + '], [' + ISO8601 + '] or [' + new Date().toISOString() + '].');
        }

        break;

      case Format.SLUG:
        if (!/^([\w\/-]|[\w-][\w\/-]*[\w-])$/.test(value)) {
          throw new Error('Field [' + field.getName() + '] must be a valid [' + field.getFormat().getValue() + '].');
        }

        break;

      case Format.EMAIL:
        if (!/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(value)) {
          throw new Error('Field [' + field.getName() + '] must be a valid [' + field.getFormat().getValue() + '].');
        }

        break;

      case Format.HASHTAG:
        if (!HashtagUtils.isValid(value)) {
          throw new Error('Field [' + field.getName() + '] must be a valid hashtag. @see HashtagUtils.isValid.');
        }

        break;

      case Format.IPV4:
        if (!/^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/.test(value)) {
          throw new Error('Field [' + field.getName() + '] must be a valid [' + field.getFormat().getValue() + '].');
        }

        break;

      case Format.IPV6:
        if (!/^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/.test(value)) {
          throw new Error('Field [' + field.getName() + '] must be a valid [' + field.getFormat().getValue() + '].');
        }

        break;

      case Format.HOSTNAME:
      case Format.URI:
      case Format.URL:
        if (!/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/.test(value)) {
          throw new Error('Field [' + field.getName() + '] must be a valid [' + field.getFormat().getValue() + '].');
        }

        break;

      case Format.UUID:
        if (!/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/.test(value)) {
          throw new Error('Field [' + field.getName() + '] must be a valid [' + field.getFormat().getValue() + '].');
        }

        break;

      default:
        break;
    }
  }

  /**
   * {@inheritdoc}
   */
  getMaxBytes() {
    return 255;
  }
}
