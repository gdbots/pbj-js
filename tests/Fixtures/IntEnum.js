import Enum from '@gdbots/common/Enum';

export default class IntEnum extends Enum {
}

IntEnum.configure({
  UNKNOWN: 0,
  ENUM1: 1,
  ENUM2: 2,
}, 'gdbots:pbj:int-enum');
