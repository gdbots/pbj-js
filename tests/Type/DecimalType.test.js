import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import DecimalType from '../../src/Type/DecimalType';
import * as helpers from './helpers';

test('DecimalType property tests', (assert) => {
  const decimalType = DecimalType.create();
  assert.true(decimalType instanceof Type);
  assert.true(decimalType instanceof DecimalType);
  assert.same(decimalType, DecimalType.create());
  assert.same(decimalType.getTypeName(), TypeName.DECIMAL);
  assert.same(decimalType.getTypeValue(), TypeName.DECIMAL.valueOf());
  assert.same(decimalType.isScalar(), true);
  assert.same(decimalType.encodesToScalar(), true);
  assert.same(decimalType.getDefault(), 0.0);
  assert.same(decimalType.isBoolean(), false);
  assert.same(decimalType.isBinary(), false);
  assert.same(decimalType.isNumeric(), true);
  assert.same(decimalType.isString(), false);
  assert.same(decimalType.isMessage(), false);
  assert.same(decimalType.allowedInSet(), true);

  try {
    decimalType.test = 1;
    assert.fail('decimalType instance is mutable');
  } catch (e) {
    assert.pass('decimalType instance is immutable');
  }

  assert.end();
});


test('DecimalType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: DecimalType.create() });
  const valid = [0.0, 3.14, -3.14, Number.MIN_VALUE, Number.MAX_VALUE];
  const invalid = ['0', '0.0', '3.14', '-3.14', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('DecimalType encode tests', (assert) => {
  const field = new Field({ name: 'test', type: DecimalType.create() });
  const samples = [
    { input: 0.1, output: '0.10' },
    { input: 3.14159265358979, output: '3.14' },
    { input: -3.14159265358979, output: '-3.14' },
    { input: false, output: '0.00' },
    { input: '', output: '0.00' },
    { input: null, output: '0.00' },
    { input: undefined, output: '0.00' },
    { input: NaN, output: '0.00' },
    { input: '3.14159265358979', output: '3.14' },
    { input: '-3.14159265358979', output: '-3.14' },
  ];

  helpers.encodeSamples(field, samples, assert);
  assert.comment('test samples with scale of 6');

  const fieldWith6Scale = new Field({ name: 'test_6_scale', type: DecimalType.create(), precision: 10, scale: 6 });
  const samplesWith6Scale = [
    { input: 0.1, output: '0.100000' },
    { input: 1.1, output: '1.100000' },
    { input: 3.14159265358979, output: '3.141593' },
    { input: -3.14159265358979, output: '-3.141593' },
    { input: '3.14159265358979', output: '3.141593' },
    { input: '-3.14159265358979', output: '-3.141593' },
  ];

  helpers.encodeSamples(fieldWith6Scale, samplesWith6Scale, assert);

  assert.end();
});


test('DecimalType decode tests', (assert) => {
  const field = new Field({ name: 'test', type: DecimalType.create() });
  const samples = [
    { input: 0, output: 0 },
    { input: 3.14159265358979, output: 3.14 },
    { input: -3.14159265358979, output: -3.14 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: '3.14159265358979', output: 3.14 },
    { input: '-3.14159265358979', output: -3.14 },
  ];

  helpers.decodeSamples(field, samples, assert);

  const fieldWith6Scale = new Field({ name: 'test_6_scale', type: DecimalType.create(), precision: 10, scale: 6 });
  const samplesWith6Scale = [
    { input: '0.100000', output: 0.1 },
    { input: '1.100000', output: 1.1 },
    { input: 3.14159265358979, output: 3.141593 },
    { input: -3.14159265358979, output: -3.141593 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: '3.14159265358979', output: 3.141593 },
    { input: '-3.14159265358979', output: -3.141593 },
  ];

  helpers.decodeSamples(fieldWith6Scale, samplesWith6Scale, assert);

  assert.end();
});
