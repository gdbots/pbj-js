import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import IntEnumType from '../../src/types/IntEnumType';
import SampleIntEnum from '../fixtures/enums/SampleIntEnum';
import SampleStringEnum from '../fixtures/enums/SampleStringEnum';
import helpers from './helpers';

test('IntEnumType property tests', (t) => {
  const intEnumType = IntEnumType.create();
  t.true(intEnumType instanceof Type);
  t.true(intEnumType instanceof IntEnumType);
  t.same(intEnumType, IntEnumType.create());
  t.true(intEnumType === IntEnumType.create());
  t.same(intEnumType.getTypeName(), TypeName.INT_ENUM);
  t.same(intEnumType.getTypeValue(), TypeName.INT_ENUM.valueOf());
  t.same(intEnumType.isScalar(), false);
  t.same(intEnumType.encodesToScalar(), true);
  t.same(intEnumType.getDefault(), null);
  t.same(intEnumType.isBoolean(), false);
  t.same(intEnumType.isBinary(), false);
  t.same(intEnumType.isNumeric(), true);
  t.same(intEnumType.isString(), false);
  t.same(intEnumType.isMessage(), false);
  t.same(intEnumType.allowedInSet(), true);
  t.same(intEnumType.getMin(), 0);
  t.same(intEnumType.getMax(), 65535);

  try {
    intEnumType.test = 1;
    t.fail('IntEnumType instance is mutable');
  } catch (e) {
    t.pass('IntEnumType instance is immutable');
  }

  t.end();
});


test('IntEnumType guard tests', (t) => {
  const field = new Field({ name: 'test', type: IntEnumType.create(), classProto: SampleIntEnum });
  const valid = [SampleIntEnum.UNKNOWN, SampleIntEnum.ENUM1, SampleIntEnum.ENUM2];
  const invalid = [0, 1, 2, '0', '1', '2', null, [], {}, '', NaN, undefined, SampleStringEnum.UNKNOWN];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('IntEnumType encode tests', (t) => {
  const field = new Field({ name: 'test', type: IntEnumType.create(), classProto: SampleIntEnum });
  const samples = [
    { input: SampleIntEnum.UNKNOWN, output: 0 },
    { input: SampleIntEnum.ENUM1, output: 1 },
    { input: SampleIntEnum.ENUM2, output: 2 },
    { input: 0, output: 0 },
    { input: 1, output: 0 },
    { input: 2, output: 0 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: SampleStringEnum.UNKNOWN, output: 0 },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('IntEnumType decode tests', (t) => {
  const field = new Field({ name: 'test', type: IntEnumType.create(), classProto: SampleIntEnum });
  const samples = [
    { input: 0, output: SampleIntEnum.UNKNOWN },
    { input: 1, output: SampleIntEnum.ENUM1 },
    { input: 2, output: SampleIntEnum.ENUM2 },
    { input: null, output: null },
  ];

  helpers.decodeSamples(field, samples, t);
  t.end();
});


test('IntEnumType decode(invalid) tests', (t) => {
  const field = new Field({ name: 'test', type: IntEnumType.create(), classProto: SampleIntEnum });
  const samples = [3, false, [], {}, '', NaN, undefined, SampleStringEnum.UNKNOWN];
  helpers.decodeInvalidSamples(field, samples, t);
  t.end();
});
