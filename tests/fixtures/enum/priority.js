'use strict';

import Enum from 'gdbots/common/enum';
import SystemUtils from 'gdbots/common/util/system-utils';

/**
 * @method static Priority NORMAL()
 * @method static Priority HIGH()
 * @method static Priority LOW()
 */
export default class Priority extends SystemUtils.mixinClass(Enum) {}

Priority.initEnum({
  NORMAL: 1,
  HIGH: 2,
  LOW: 3
});
