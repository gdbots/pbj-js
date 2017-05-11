'use strict';

import Enum from 'gdbots/common/enum';
import SystemUtils from 'gdbots/common/util/system-utils';

/**
 * @method static FieldRule A_SINGLE_VALUE()
 * @method static FieldRule A_SET()
 * @method static FieldRule A_LIST()
 * @method static FieldRule A_MAP()
 */
export default class FieldRule extends SystemUtils.mixinClass(Enum) {}

FieldRule.initEnum({
  A_SINGLE_VALUE: 1,
  A_SET: 2,
  A_LIST: 3,
  A_MAP: 4
});
