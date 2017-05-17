import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import intType from '../../src/Type/intType';
import * as helpers from './helpers';

test('intType property tests', (assert) => {
  assert.true(intType instanceof Type);
  assert.same(intType.getTypeName(), TypeName.INT);
  assert.same(intType.getTypeValue(), TypeName.INT.valueOf());
  assert.same(intType.isScalar(), true);
  assert.same(intType.encodesToScalar(), true);
  assert.same(intType.getDefault(), 0);
  assert.same(intType.isBoolean(), false);
  assert.same(intType.isBinary(), false);
  assert.same(intType.isNumeric(), true);
  assert.same(intType.isString(), false);
  assert.same(intType.isMessage(), false);
  assert.same(intType.allowedInSet(), true);

  try {
    intType.test = 1;
    assert.fail('intType instance is mutable');
  } catch (e) {
    assert.pass('intType instance is immutable');
  }

  assert.end();
});


test('intType guard tests', (assert) => {
  const field = new Field('test', intType);
  const valid = [0, 4294967295, 1, 4294967294];
  const invalid = [-1, 4294967296, '0', '4294967295', '', NaN, undefined, null];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('intType encode tests', (assert) => {
  const field = new Field('test', intType);
  const samples = [
    { input: 0, output: 0 },
    { input: 4294967295, output: 4294967295 },
    { input: 1, output: 1 },
    { input: 4294967294, output: 4294967294 },
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


test('intType decode tests', (assert) => {
  const field = new Field('test', intType);
  const samples = [
    { input: 0, output: 0 },
    { input: 4294967295, output: 4294967295 },
    { input: 1, output: 1 },
    { input: 4294967294, output: 4294967294 },
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
