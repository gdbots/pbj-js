import Enum from '@gdbots/common/Enum';

/**
 * @link http://spacetelescope.github.io/understanding-json-schema/reference/string.html#format
 */
export default class Format extends Enum {
}

Format.configure({
  UNKNOWN: 'unknown',
  DATE: 'date',
  DATE_TIME: 'date-time',
  EMAIL: 'email',
  HASHTAG: 'hashtag',
  HOSTNAME: 'hostname',
  IPV4: 'ipv4',
  IPV6: 'ipv6',
  SLUG: 'slug',
  URI: 'uri',
  URL: 'url',
  UUID: 'uuid',
}, 'gdbots:pbj:format');
