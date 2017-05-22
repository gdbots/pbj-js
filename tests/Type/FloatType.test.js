import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import FloatType from '../../src/Type/FloatType';
import * as helpers from './helpers';

test('FloatType property tests', (assert) => {
  const floatType = FloatType.create();
  assert.true(floatType instanceof Type);
  assert.true(floatType instanceof FloatType);
  assert.same(floatType, FloatType.create());
  assert.same(floatType.getTypeName(), TypeName.FLOAT);
  assert.same(floatType.getTypeValue(), TypeName.FLOAT.valueOf());
  assert.same(floatType.isScalar(), true);
  assert.same(floatType.encodesToScalar(), true);
  assert.same(floatType.getDefault(), 0.0);
  assert.same(floatType.isBoolean(), false);
  assert.same(floatType.isBinary(), false);
  assert.same(floatType.isNumeric(), true);
  assert.same(floatType.isString(), false);
  assert.same(floatType.isMessage(), false);
  assert.same(floatType.allowedInSet(), true);

  try {
    floatType.test = 1;
    assert.fail('floatType instance is mutable');
  } catch (e) {
    assert.pass('floatType instance is immutable');
  }

  assert.end();
});


test('FloatType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: FloatType.create() });
  const valid = [
    0.0, 3.14159265358979323846, -3.14159265358979323846, Number.MIN_VALUE, Number.MAX_VALUE,
  ];
  const invalid = [
    '0', '0.0', '3.14159265358979323846', '-3.14159265358979323846', null, [], {}, '', NaN, undefined,
  ];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('FloatType encode tests', (assert) => {
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

  helpers.encodeSamples(field, samples, assert);
  assert.end();
});


test('FloatType decode tests', (assert) => {
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

  helpers.decodeSamples(field, samples, assert);
  assert.end();
});
