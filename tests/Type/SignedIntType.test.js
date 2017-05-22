import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import SignedIntType from '../../src/Type/SignedIntType';
import * as helpers from './helpers';

test('SignedIntType property tests', (assert) => {
  const signedIntType = SignedIntType.create();
  assert.true(signedIntType instanceof Type);
  assert.true(signedIntType instanceof SignedIntType);
  assert.same(signedIntType, SignedIntType.create());
  assert.same(signedIntType.getTypeName(), TypeName.SIGNED_INT);
  assert.same(signedIntType.getTypeValue(), TypeName.SIGNED_INT.valueOf());
  assert.same(signedIntType.isScalar(), true);
  assert.same(signedIntType.encodesToScalar(), true);
  assert.same(signedIntType.getDefault(), 0);
  assert.same(signedIntType.isBoolean(), false);
  assert.same(signedIntType.isBinary(), false);
  assert.same(signedIntType.isNumeric(), true);
  assert.same(signedIntType.isString(), false);
  assert.same(signedIntType.isMessage(), false);
  assert.same(signedIntType.allowedInSet(), true);

  try {
    signedIntType.test = 1;
    assert.fail('signedIntType instance is mutable');
  } catch (e) {
    assert.pass('signedIntType instance is immutable');
  }

  assert.end();
});


test('SignedIntType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: SignedIntType.create() });
  const valid = [0, -2147483648, 2147483647, -2147483647, 2147483646];
  const invalid = [-2147483649, 2147483648, '-2147483648', '2147483647', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('SignedIntType encode tests', (assert) => {
  const field = new Field({ name: 'test', type: SignedIntType.create() });
  const samples = [
    { input: -2147483648, output: -2147483648 },
    { input: 2147483647, output: 2147483647 },
    { input: -2147483647, output: -2147483647 },
    { input: 2147483646, output: 2147483646 },
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


test('SignedIntType decode tests', (assert) => {
  const field = new Field({ name: 'test', type: SignedIntType.create() });
  const samples = [
    { input: -2147483648, output: -2147483648 },
    { input: 2147483647, output: 2147483647 },
    { input: -2147483647, output: -2147483647 },
    { input: 2147483646, output: 2147483646 },
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
