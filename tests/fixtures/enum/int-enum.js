'use strict';

import Enum from 'gdbots/common/enum';
import SystemUtils from 'gdbots/common/util/system-utils';

/**
 * @method static IntEnum UNKNOWN()
 * @method static IntEnum A_INT()
 */
export default class IntEnum extends SystemUtils.mixinClass(Enum) {}

IntEnum.initEnum({
  UNKNOWN: 0,
  A_INT: 1
});
