'use strict';

import Enum from 'gdbots/common/enum';
import SystemUtils from 'gdbots/common/util/system-utils';

/**
 * @link http://spacetelescope.github.io/understanding-json-schema/reference/string.html#format
 *
 * @method static Format UNKNOWN()
 * @method static Format DATE()
 * @method static Format DATE_TIME()
 * @method static Format EMAIL()
 * @method static Format HASHTAG()
 * @method static Format HOSTNAME()
 * @method static Format IPV4()
 * @method static Format IPV6()
 * @method static Format SLUG()
 * @method static Format URI()
 * @method static Format URL()
 * @method static Format UUID()
 */
export default class Format extends SystemUtils.mixinClass(Enum) {}

Format.initEnum({
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
  UUID: 'uuid'
});
