import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import signedMediumIntType from '../../src/Type/signedMediumIntType';
import * as helpers from './helpers';

test('signedMediumIntType property tests', (assert) => {
  assert.true(signedMediumIntType instanceof Type);
  assert.same(signedMediumIntType.getTypeName(), TypeName.SIGNED_MEDIUM_INT);
  assert.same(signedMediumIntType.getTypeValue(), TypeName.SIGNED_MEDIUM_INT.valueOf());
  assert.same(signedMediumIntType.isScalar(), true);
  assert.same(signedMediumIntType.encodesToScalar(), true);
  assert.same(signedMediumIntType.getDefault(), 0);
  assert.same(signedMediumIntType.isBoolean(), false);
  assert.same(signedMediumIntType.isBinary(), false);
  assert.same(signedMediumIntType.isNumeric(), true);
  assert.same(signedMediumIntType.isString(), false);
  assert.same(signedMediumIntType.isMessage(), false);
  assert.same(signedMediumIntType.allowedInSet(), true);

  try {
    signedMediumIntType.test = 1;
    assert.fail('signedMediumIntType instance is mutable');
  } catch (e) {
    assert.pass('signedMediumIntType instance is immutable');
  }

  assert.end();
});


test('signedMediumIntType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: signedMediumIntType });
  const valid = [0, -8388608, 8388607, -8388607, 8388606];
  const invalid = [-8388609, 8388608, '-8388608', '8388607', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('signedMediumIntType encode tests', (assert) => {
  const field = new Field({ name: 'test', type: signedMediumIntType });
  const samples = [
    { input: -8388608, output: -8388608 },
    { input: 8388607, output: 8388607 },
    { input: -8388607, output: -8388607 },
    { input: 8388606, output: 8388606 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: 0, output: 0 },
    { input: NaN, output: 0 },
    { input: 3.14, output: 3 },
    { input: -3.14, output: -3 },
    { input: '3.14', output: 3 },
    { input: '-3.14', output: -3 },
  ];

  helpers.encodeSamples(field, samples, assert);
  assert.end();
});


test('signedMediumIntType decode tests', (assert) => {
  const field = new Field({ name: 'test', type: signedMediumIntType });
  const samples = [
    { input: -8388608, output: -8388608 },
    { input: 8388607, output: 8388607 },
    { input: -8388607, output: -8388607 },
    { input: 8388606, output: 8388606 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: 0, output: 0 },
    { input: NaN, output: 0 },
    { input: 3.14, output: 3 },
    { input: -3.14, output: -3 },
    { input: '3.14', output: 3 },
    { input: '-3.14', output: -3 },
  ];

  helpers.decodeSamples(field, samples, assert);
  assert.end();
});
