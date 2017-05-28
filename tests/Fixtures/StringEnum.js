import Enum from '@gdbots/common/Enum';

export default class StringEnum extends Enum {
}

StringEnum.configure({
  UNKNOWN: 'unknown',
  ENUM1: 'val1',
  ENUM2: 'val2',
}, 'gdbots:pbj:string-enum');
