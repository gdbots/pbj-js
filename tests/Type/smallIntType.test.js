import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import smallIntType from '../../src/Type/smallIntType';
import * as helpers from './helpers';

test('smallIntType property tests', (assert) => {
  assert.true(smallIntType instanceof Type);
  assert.same(smallIntType.getTypeName(), TypeName.SMALL_INT);
  assert.same(smallIntType.getTypeValue(), TypeName.SMALL_INT.valueOf());
  assert.same(smallIntType.isScalar(), true);
  assert.same(smallIntType.encodesToScalar(), true);
  assert.same(smallIntType.getDefault(), 0);
  assert.same(smallIntType.isBoolean(), false);
  assert.same(smallIntType.isBinary(), false);
  assert.same(smallIntType.isNumeric(), true);
  assert.same(smallIntType.isString(), false);
  assert.same(smallIntType.isMessage(), false);
  assert.same(smallIntType.allowedInSet(), true);

  try {
    smallIntType.test = 1;
    assert.fail('smallIntType instance is mutable');
  } catch (e) {
    assert.pass('smallIntType instance is immutable');
  }

  assert.end();
});


test('smallIntType guard tests', (assert) => {
  const field = new Field('test', smallIntType);
  const valid = [0, 65535, 1, 65534];
  const invalid = [-1, 65536, '0', '65535', '', NaN, undefined, null];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('smallIntType encode tests', (assert) => {
  const field = new Field('test', smallIntType);
  const samples = [
    { input: 0, output: 0 },
    { input: 65535, output: 65535 },
    { input: 1, output: 1 },
    { input: 65534, output: 65534 },
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


test('smallIntType decode tests', (assert) => {
  const field = new Field('test', smallIntType);
  const samples = [
    { input: 0, output: 0 },
    { input: 65535, output: 65535 },
    { input: 1, output: 1 },
    { input: 65534, output: 65534 },
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

