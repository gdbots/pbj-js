import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import DynamicFieldType from '../../src/types/DynamicFieldType';
import DynamicField from '../../src/well-known/DynamicField';
import helpers from './helpers';

test('DynamicFieldType property tests', (t) => {
  const dynamicFieldType = DynamicFieldType.create();
  t.true(dynamicFieldType instanceof Type);
  t.true(dynamicFieldType instanceof DynamicFieldType);
  t.same(dynamicFieldType, DynamicFieldType.create());
  t.true(dynamicFieldType === DynamicFieldType.create());
  t.same(dynamicFieldType.getTypeName(), TypeName.DYNAMIC_FIELD);
  t.same(dynamicFieldType.getTypeValue(), TypeName.DYNAMIC_FIELD.valueOf());
  t.same(dynamicFieldType.isScalar(), false);
  t.same(dynamicFieldType.encodesToScalar(), false);
  t.same(dynamicFieldType.getDefault(), null);
  t.same(dynamicFieldType.isBoolean(), false);
  t.same(dynamicFieldType.isBinary(), false);
  t.same(dynamicFieldType.isNumeric(), false);
  t.same(dynamicFieldType.isString(), false);
  t.same(dynamicFieldType.isMessage(), false);
  t.same(dynamicFieldType.allowedInSet(), false);

  try {
    dynamicFieldType.test = 1;
    t.fail('DynamicFieldType instance is mutable');
  } catch (e) {
    t.pass('DynamicFieldType instance is immutable');
  }

  t.end();
});


test('DynamicFieldType guard tests', (t) => {
  const field = new Field({ name: 'test', type: DynamicFieldType.create() });
  const valid = [
    DynamicField.createStringVal('test', 'taco'),
    DynamicField.createIntVal('test', 9000),
  ];
  const invalid = [
    'test',
    null,
    [],
    {},
    '',
    NaN,
    undefined,
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('DynamicFieldType encode tests', (t) => {
  const field = new Field({ name: 'test', type: DynamicFieldType.create() });
  const codec = { encodeDynamicField: value => value.toJSON() };
  const samples = [
    {
      input: DynamicField.createStringVal('test', 'taco'),
      output: { name: 'test', string_val: 'taco' },
    },
    {
      input: DynamicField.createBoolVal('test', true),
      output: { name: 'test', bool_val: true },
    },
    { input: 0, output: null },
    { input: 1, output: null },
    { input: 2, output: null },
    { input: false, output: null },
    { input: '', output: null },
    { input: null, output: null },
    { input: undefined, output: null },
    { input: NaN, output: null },
  ];

  helpers.encodeSamples(field, samples, t, codec);
  t.end();
});


test('DynamicFieldType decode tests', (t) => {
  const field = new Field({ name: 'test', type: DynamicFieldType.create() });
  const codec = { decodeDynamicField: value => DynamicField.fromObject(value) };
  const df = DynamicField.createStringVal('test1', 'taco');
  const samples = [
    {
      input: { name: 'test', string_val: 'taco' },
      output: DynamicField.createStringVal('test', 'taco'),
    },
    {
      input: { name: 'test', bool_val: true },
      output: DynamicField.createBoolVal('test', true),
    },
    { input: df, output: df },
    { input: null, output: null },
  ];

  helpers.decodeSamples(field, samples, t, codec);
  t.end();
});


test('DynamicFieldType decode(invalid) tests', (t) => {
  const field = new Field({ name: 'test', type: DynamicFieldType.create() });
  const codec = { decodeDynamicField: value => DynamicField.fromObject(value) };
  const samples = [
    'nope',
    { name: 'test', nothing: true },
    { name: 'test' },
    false,
    [],
    {},
    '',
    NaN,
    undefined,
  ];
  helpers.decodeInvalidSamples(field, samples, t, codec);
  t.end();
});
