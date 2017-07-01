import Enum from '@gdbots/common/Enum';

export default class FieldRule extends Enum {
}

FieldRule.configure({
  A_SINGLE_VALUE: 1,
  A_SET: 2,
  A_LIST: 3,
  A_MAP: 4,
}, 'gdbots:pbj:field-rule');
