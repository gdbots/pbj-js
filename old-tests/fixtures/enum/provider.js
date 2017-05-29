'use strict';

import Enum from 'gdbots/common/enum';
import SystemUtils from 'gdbots/common/util/system-utils';

/**
 * @method static Provider AOL()
 * @method static Provider GMAIL()
 * @method static Provider HOTMAIL()
 */
export default class Provider extends SystemUtils.mixinClass(Enum) {}

Provider.initEnum({
  AOL: 'aol',
  GMAIL: 'gmail',
  HOTMAIL: 'hotmail'
});
