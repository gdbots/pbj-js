'use strict';

import Enum from 'gdbots/common/enum';
import SystemUtils from 'gdbots/common/util/system-utils';

/**
 * @method static StringEnum UNKNOWN()
 * @method static StringEnum A_STRING()
 */
export default class StringEnum extends SystemUtils.mixinClass(Enum) {}

StringEnum.initEnum({
  UNKNOWN: 'unknown',
  A_STRING: 'string'
});
