import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import tinyIntType from '../../src/Type/tinyIntType';
import * as helpers from './helpers';

test('tinyIntType property tests', (assert) => {
  assert.true(tinyIntType instanceof Type);
  assert.same(tinyIntType.getTypeName(), TypeName.TINY_INT);
  assert.same(tinyIntType.getTypeValue(), TypeName.TINY_INT.valueOf());
  assert.same(tinyIntType.isScalar(), true);
  assert.same(tinyIntType.encodesToScalar(), true);
  assert.same(tinyIntType.getDefault(), 0);
  assert.same(tinyIntType.isBoolean(), false);
  assert.same(tinyIntType.isBinary(), false);
  assert.same(tinyIntType.isNumeric(), true);
  assert.same(tinyIntType.isString(), false);
  assert.same(tinyIntType.isMessage(), false);
  assert.same(tinyIntType.allowedInSet(), true);

  try {
    tinyIntType.test = 1;
    assert.fail('tinyIntType instance is mutable');
  } catch (e) {
    assert.pass('tinyIntType instance is immutable');
  }

  assert.end();
});


test('tinyIntType guard tests', (assert) => {
  const field = new Field('test', tinyIntType);
  const valid = [0, 255, 1, 254];
  const invalid = [-1, 256, '0', '255', '', NaN, undefined, null];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('tinyIntType encode tests', (assert) => {
  const field = new Field('test', tinyIntType);
  const samples = [
    { input: 0, output: 0 },
    { input: 255, output: 255 },
    { input: 1, output: 1 },
    { input: 254, output: 254 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: 3.14, output: 3 },
    { input: '3.14', output: 3 },
  ];

  helpers.encodeSamples(field, samples, assert);
  assert.end();
});


test('tinyIntType decode tests', (assert) => {
  const field = new Field('test', tinyIntType);
  const samples = [
    { input: 0, output: 0 },
    { input: 255, output: 255 },
    { input: 1, output: 1 },
    { input: 254, output: 254 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: 3.14, output: 3 },
    { input: '3.14', output: 3 },
  ];

  helpers.decodeSamples(field, samples, assert);
  assert.end();
});
