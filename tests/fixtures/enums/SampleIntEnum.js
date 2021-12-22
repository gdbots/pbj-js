import Enum from '../../../src/Enum.js';

export default class SampleIntEnum extends Enum {
}

SampleIntEnum.configure({
  UNKNOWN: 0,
  ENUM1: 1,
  ENUM2: 2,
}, 'gdbots:pbj.tests:sample-int-enum');
