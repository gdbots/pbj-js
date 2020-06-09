import Enum from '../../../src/Enum';

export default class SampleStringEnum extends Enum {
}

SampleStringEnum.configure({
  UNKNOWN: 'unknown',
  ENUM1: 'val1',
  ENUM2: 'val2',
}, 'gdbots:pbj.tests:sample-string-enum');
