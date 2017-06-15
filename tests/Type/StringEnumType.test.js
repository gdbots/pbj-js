import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import StringEnumType from '../../src/Type/StringEnumType';
import SampleIntEnum from '../Fixtures/Enum/SampleIntEnum';
import SampleStringEnum from '../Fixtures/Enum/SampleStringEnum';
import helpers from './helpers';

test('StringEnumType property tests', (t) => {
  const stringEnumType = StringEnumType.create();
  t.true(stringEnumType instanceof Type);
  t.true(stringEnumType instanceof StringEnumType);
  t.same(stringEnumType, StringEnumType.create());
  t.true(stringEnumType === StringEnumType.create());
  t.same(stringEnumType.getTypeName(), TypeName.STRING_ENUM);
  t.same(stringEnumType.getTypeValue(), TypeName.STRING_ENUM.valueOf());
  t.same(stringEnumType.isScalar(), false);
  t.same(stringEnumType.encodesToScalar(), true);
  t.same(stringEnumType.getDefault(), null);
  t.same(stringEnumType.isBoolean(), false);
  t.same(stringEnumType.isBinary(), false);
  t.same(stringEnumType.isNumeric(), false);
  t.same(stringEnumType.isString(), true);
  t.same(stringEnumType.isMessage(), false);
  t.same(stringEnumType.allowedInSet(), true);
  t.same(stringEnumType.getMaxBytes(), 100);

  try {
    stringEnumType.test = 1;
    t.fail('StringEnumType instance is mutable');
  } catch (e) {
    t.pass('StringEnumType instance is immutable');
  }

  t.end();
});


test('StringEnumType guard tests', (t) => {
  const field = new Field({ name: 'test', type: StringEnumType.create(), classProto: SampleStringEnum });
  const valid = [SampleStringEnum.UNKNOWN, SampleStringEnum.ENUM1, SampleStringEnum.ENUM2];
  const invalid = [0, 1, 2, '0', '1', '2', null, [], {}, '', NaN, undefined, SampleIntEnum.UNKNOWN];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringEnumType encode tests', (t) => {
  const field = new Field({ name: 'test', type: StringEnumType.create(), classProto: SampleStringEnum });
  const samples = [
    { input: SampleStringEnum.UNKNOWN, output: 'unknown' },
    { input: SampleStringEnum.ENUM1, output: 'val1' },
    { input: SampleStringEnum.ENUM2, output: 'val2' },
    { input: 0, output: null },
    { input: 1, output: null },
    { input: 2, output: null },
    { input: false, output: null },
    { input: '', output: null },
    { input: null, output: null },
    { input: undefined, output: null },
    { input: NaN, output: null },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('StringEnumType decode tests', (t) => {
  const field = new Field({ name: 'test', type: StringEnumType.create(), classProto: SampleStringEnum });
  const samples = [
    { input: 'unknown', output: SampleStringEnum.UNKNOWN },
    { input: 'val1', output: SampleStringEnum.ENUM1 },
    { input: 'val2', output: SampleStringEnum.ENUM2 },
    { input: null, output: null },
  ];

  helpers.decodeSamples(field, samples, t);
  t.end();
});


test('StringEnumType decode(invalid) tests', (t) => {
  const field = new Field({ name: 'test', type: StringEnumType.create(), classProto: SampleStringEnum });
  const samples = ['nope', false, [], {}, '', NaN, undefined, SampleIntEnum.UNKNOWN];
  helpers.decodeInvalidSamples(field, samples, t);
  t.end();
});
