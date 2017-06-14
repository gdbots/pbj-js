import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import FloatType from '../../src/Type/FloatType';
import * as helpers from './helpers';

test('FloatType property tests', (t) => {
  const floatType = FloatType.create();
  t.true(floatType instanceof Type);
  t.true(floatType instanceof FloatType);
  t.same(floatType, FloatType.create());
  t.true(floatType === FloatType.create());
  t.same(floatType.getTypeName(), TypeName.FLOAT);
  t.same(floatType.getTypeValue(), TypeName.FLOAT.valueOf());
  t.same(floatType.isScalar(), true);
  t.same(floatType.encodesToScalar(), true);
  t.same(floatType.getDefault(), 0.0);
  t.same(floatType.isBoolean(), false);
  t.same(floatType.isBinary(), false);
  t.same(floatType.isNumeric(), true);
  t.same(floatType.isString(), false);
  t.same(floatType.isMessage(), false);
  t.same(floatType.allowedInSet(), true);
  t.same(floatType.getMin(), Number.MIN_VALUE);
  t.same(floatType.getMax(), Number.MAX_VALUE);

  try {
    floatType.test = 1;
    t.fail('floatType instance is mutable');
  } catch (e) {
    t.pass('floatType instance is immutable');
  }

  t.end();
});


test('FloatType guard tests', (t) => {
  const field = new Field({ name: 'test', type: FloatType.create() });
  const valid = [
    0.0, 3.14159265358979323846, -3.14159265358979323846, Number.MIN_VALUE, Number.MAX_VALUE,
  ];
  const invalid = [
    '0', '0.0', '3.14159265358979323846', '-3.14159265358979323846', null, [], {}, '', NaN, undefined,
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('FloatType encode tests', (t) => {
  const field = new Field({ name: 'test', type: FloatType.create() });
  const samples = [
    { input: 0.0, output: 0.0 },
    { input: 3.14159265358979, output: 3.14159265358979 },
    { input: -3.14159265358979, output: -3.14159265358979 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: '3.14159265358979', output: 3.14159265358979 },
    { input: '-3.14159265358979', output: -3.14159265358979 },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('FloatType decode tests', (t) => {
  const field = new Field({ name: 'test', type: FloatType.create() });
  const samples = [
    { input: 0.0, output: 0.0 },
    { input: 3.14159265358979, output: 3.14159265358979 },
    { input: -3.14159265358979, output: -3.14159265358979 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: '3.14159265358979', output: 3.14159265358979 },
    { input: '-3.14159265358979', output: -3.14159265358979 },
  ];

  helpers.decodeSamples(field, samples, t);
  t.end();
});
