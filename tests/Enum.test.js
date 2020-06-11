import test from 'tape';
import Enum from '../src/Enum';
import IntEnum from './fixtures/enums/SampleIntEnum';
import StringEnum from './fixtures/enums/SampleStringEnum';

test('Enum immutability tests', (assert) => {
  try {
    StringEnum.ENUM1 = 'test';
    assert.fail('StringEnum class is mutable');
  } catch (e) {
    assert.pass('StringEnum class is immutable');
  }

  try {
    const test1 = StringEnum.create('val1');
    test1.ENUM1 = 'test';
    assert.fail('StringEnum instance is mutable');
  } catch (e) {
    assert.pass('StringEnum instance is immutable');
  }

  try {
    IntEnum.ENUM1 = 1;
    assert.fail('IntEnum class is mutable');
  } catch (e) {
    assert.pass('IntEnum class is immutable');
  }

  try {
    const test2 = IntEnum.create(2);
    test2.ENUM2 = 2;
    assert.fail('IntEnum instance is mutable');
  } catch (e) {
    assert.pass('IntEnum instance is immutable');
  }

  assert.end();
});

test('Enum flyweight tests', (assert) => {
  const test1 = StringEnum.create('val1');
  const test2 = StringEnum.create('val1');
  assert.true(StringEnum.ENUM1 === test1);
  assert.true(StringEnum.ENUM1 === test2);
  assert.true(test1 === test2);

  try {
    const cantNew = new StringEnum('ENUM3', 'val3');
    assert.fail('StringEnum instance can be created with "new".');
  } catch (e) {
    assert.pass('StringEnum instance cannot be created with "new".');
  }

  assert.end();
});

test('StringEnum tests', (assert) => {
  const test1 = StringEnum.create('val1');
  const test2 = StringEnum.create('val2');

  assert.comment('Assert instances match expected values.');
  assert.equal(StringEnum.ENUM1.getValue(), 'val1');
  assert.equal(StringEnum.ENUM2.getValue(), 'val2');
  assert.equal(StringEnum.ENUM1.getValue(), test1.getValue());
  assert.equal(StringEnum.ENUM2.getValue(), test2.getValue());

  assert.comment('Assert instances from static access match ones created from value.');
  assert.equal(StringEnum.ENUM1, test1);
  assert.equal(StringEnum.ENUM2, test2);

  assert.comment('Assert enumIds match.');
  assert.equal(StringEnum.getEnumId(), 'gdbots:pbj.tests:sample-string-enum');
  assert.equal(StringEnum.ENUM1.getEnumId(), 'gdbots:pbj.tests:sample-string-enum');
  assert.equal(test1.getEnumId(), 'gdbots:pbj.tests:sample-string-enum');
  assert.equal(StringEnum.ENUM2.getEnumId(), 'gdbots:pbj.tests:sample-string-enum');
  assert.equal(test2.getEnumId(), 'gdbots:pbj.tests:sample-string-enum');

  assert.comment('Assert instanceOf matches concrete and abstract Enum.');
  assert.true(StringEnum.ENUM1 instanceof Enum, 'StringEnum.ENUM1 MUST be an instanceOf Enum');
  assert.true(StringEnum.ENUM1 instanceof StringEnum, 'StringEnum.ENUM1 MUST be an instanceOf StringEnum');
  assert.true(test1 instanceof Enum, 'test1 MUST be an instanceOf Enum');
  assert.true(test1 instanceof StringEnum, 'test1 MUST be an instanceOf StringEnum');
  assert.true(StringEnum.ENUM2 instanceof Enum, 'StringEnum.ENUM2 MUST be an instanceOf Enum');
  assert.true(StringEnum.ENUM2 instanceof StringEnum, 'StringEnum.ENUM2 MUST be an instanceOf StringEnum');
  assert.true(test2 instanceof Enum, 'test2 MUST be an instanceOf Enum');
  assert.true(test2 instanceof StringEnum, 'test2 MUST be an instanceOf StringEnum');

  assert.comment('Assert getKeys and getValues match.');
  assert.same(StringEnum.getKeys(), ['UNKNOWN', 'ENUM1', 'ENUM2']);
  assert.same(StringEnum.getValues(), { UNKNOWN: 'unknown', ENUM1: 'val1', ENUM2: 'val2' });

  assert.comment('Assert instance name/values match.');
  assert.equal(test1.getName(), 'ENUM1');
  assert.equal(test1.getValue(), 'val1');

  assert.comment('Assert instance match when serialized.');
  assert.equal(test1.toString(), 'val1');
  assert.equal(test1.toJSON(), 'val1');
  assert.equal(test1.valueOf(), 'val1');
  assert.equal(`${test1}`, 'val1');
  assert.equal(JSON.stringify(test1), '"val1"');

  assert.end();
});

test('IntEnum tests', (assert) => {
  const test1 = IntEnum.create(1);
  const test2 = IntEnum.create(2);

  assert.comment('Assert instances match expected values.');
  assert.equal(IntEnum.ENUM1.getValue(), 1);
  assert.equal(IntEnum.ENUM2.getValue(), 2);
  assert.equal(IntEnum.ENUM1.getValue(), test1.getValue());
  assert.equal(IntEnum.ENUM2.getValue(), test2.getValue());

  assert.comment('Assert instances from static access match ones created from value.');
  assert.equal(IntEnum.ENUM1, test1);
  assert.equal(IntEnum.ENUM2, test2);

  assert.comment('Assert enumIds match.');
  assert.equal(IntEnum.getEnumId(), 'gdbots:pbj.tests:sample-int-enum');
  assert.equal(IntEnum.ENUM1.getEnumId(), 'gdbots:pbj.tests:sample-int-enum');
  assert.equal(test1.getEnumId(), 'gdbots:pbj.tests:sample-int-enum');
  assert.equal(IntEnum.ENUM2.getEnumId(), 'gdbots:pbj.tests:sample-int-enum');
  assert.equal(test2.getEnumId(), 'gdbots:pbj.tests:sample-int-enum');

  assert.comment('Assert instanceOf matches concrete and abstract Enum.');
  assert.true(IntEnum.ENUM1 instanceof Enum, 'IntEnum.ENUM1 MUST be an instanceOf Enum');
  assert.true(IntEnum.ENUM1 instanceof IntEnum, 'IntEnum.ENUM1 MUST be an instanceOf IntEnum');
  assert.true(test1 instanceof Enum, 'test1 MUST be an instanceOf Enum');
  assert.true(test1 instanceof IntEnum, 'test1 MUST be an instanceOf IntEnum');
  assert.true(IntEnum.ENUM2 instanceof Enum, 'IntEnum.ENUM2 MUST be an instanceOf Enum');
  assert.true(IntEnum.ENUM2 instanceof IntEnum, 'IntEnum.ENUM2 MUST be an instanceOf IntEnum');
  assert.true(test2 instanceof Enum, 'test2 MUST be an instanceOf Enum');
  assert.true(test2 instanceof IntEnum, 'test2 MUST be an instanceOf IntEnum');

  assert.comment('Assert getKeys and getValues match.');
  assert.same(IntEnum.getKeys(), ['UNKNOWN', 'ENUM1', 'ENUM2']);
  assert.same(IntEnum.getValues(), { UNKNOWN: 0, ENUM1: 1, ENUM2: 2 });

  assert.comment('Assert instance name/values match.');
  assert.equal(test1.getName(), 'ENUM1');
  assert.equal(test1.getValue(), 1);

  assert.comment('Assert instance match when serialized.');
  assert.equal(test1.toString(), '1');
  assert.equal(test1.toJSON(), 1);
  assert.equal(test1.valueOf(), 1);
  assert.equal(`${test1}`, '1');
  assert.equal(JSON.stringify(test1), '1');

  assert.end();
});
