'use strict';

import Enum from 'gdbots/common/enum';
import SystemUtils from 'gdbots/common/util/system-utils';

/**
 * @method static DynamicFieldKind BOOL_VAL()
 * @method static DynamicFieldKind DATE_VAL()
 * @method static DynamicFieldKind FLOAT_VAL()
 * @method static DynamicFieldKind INT_VAL()
 * @method static DynamicFieldKind STRING_VAL()
 * @method static DynamicFieldKind TEXT_VAL()
 */
export default class DynamicFieldKind extends SystemUtils.mixinClass(Enum) {}

DynamicFieldKind.initEnum({
  BOOL_VAL: 'bool_val',
  DATE_VAL: 'date_val',
  FLOAT_VAL: 'float_val',
  INT_VAL: 'int_val',
  STRING_VAL: 'string_val',
  TEXT_VAL: 'text_val'
});
