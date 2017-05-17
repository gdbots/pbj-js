import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import signedTinyIntType from '../../src/Type/signedTinyIntType';
import * as helpers from './helpers';

test('signedTinyIntType property tests', (assert) => {
  assert.true(signedTinyIntType instanceof Type);
  assert.same(signedTinyIntType.getTypeName(), TypeName.SIGNED_TINY_INT);
  assert.same(signedTinyIntType.getTypeValue(), TypeName.SIGNED_TINY_INT.valueOf());
  assert.same(signedTinyIntType.isScalar(), true);
  assert.same(signedTinyIntType.encodesToScalar(), true);
  assert.same(signedTinyIntType.getDefault(), 0);
  assert.same(signedTinyIntType.isBoolean(), false);
  assert.same(signedTinyIntType.isBinary(), false);
  assert.same(signedTinyIntType.isNumeric(), true);
  assert.same(signedTinyIntType.isString(), false);
  assert.same(signedTinyIntType.isMessage(), false);
  assert.same(signedTinyIntType.allowedInSet(), true);

  try {
    signedTinyIntType.test = 1;
    assert.fail('signedTinyIntType instance is mutable');
  } catch (e) {
    assert.pass('signedTinyIntType instance is immutable');
  }

  assert.end();
});


test('signedTinyIntType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: signedTinyIntType });
  const valid = [0, -128, 127, -127, 126];
  const invalid = [-129, 128, '-128', '127', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('signedTinyIntType encode tests', (assert) => {
  const field = new Field({ name: 'test', type: signedTinyIntType });
  const samples = [
    { input: -128, output: -128 },
    { input: 127, output: 127 },
    { input: -127, output: -127 },
    { input: 126, output: 126 },
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


test('signedTinyIntType decode tests', (assert) => {
  const field = new Field({ name: 'test', type: signedTinyIntType });
  const samples = [
    { input: -128, output: -128 },
    { input: 127, output: 127 },
    { input: -127, output: -127 },
    { input: 126, output: 126 },
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
