import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import SignedSmallIntType from '../../src/Type/SignedSmallIntType';
import * as helpers from './helpers';

test('signedSmallIntType property tests', (assert) => {
  const signedSmallIntType = SignedSmallIntType.create();
  assert.true(signedSmallIntType instanceof Type);
  assert.true(signedSmallIntType instanceof SignedSmallIntType);
  assert.same(signedSmallIntType, SignedSmallIntType.create());
  assert.same(signedSmallIntType.getTypeName(), TypeName.SIGNED_SMALL_INT);
  assert.same(signedSmallIntType.getTypeValue(), TypeName.SIGNED_SMALL_INT.valueOf());
  assert.same(signedSmallIntType.isScalar(), true);
  assert.same(signedSmallIntType.encodesToScalar(), true);
  assert.same(signedSmallIntType.getDefault(), 0);
  assert.same(signedSmallIntType.isBoolean(), false);
  assert.same(signedSmallIntType.isBinary(), false);
  assert.same(signedSmallIntType.isNumeric(), true);
  assert.same(signedSmallIntType.isString(), false);
  assert.same(signedSmallIntType.isMessage(), false);
  assert.same(signedSmallIntType.allowedInSet(), true);

  try {
    signedSmallIntType.test = 1;
    assert.fail('signedSmallIntType instance is mutable');
  } catch (e) {
    assert.pass('signedSmallIntType instance is immutable');
  }

  assert.end();
});


test('signedSmallIntType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: SignedSmallIntType.create() });
  const valid = [0, -32768, 32767, -32767, 32766];
  const invalid = [-32769, 32768, '-32768', '32767', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('signedSmallIntType encode tests', (assert) => {
  const field = new Field({ name: 'test', type: SignedSmallIntType.create() });
  const samples = [
    { input: -32768, output: -32768 },
    { input: 32767, output: 32767 },
    { input: -32767, output: -32767 },
    { input: 32766, output: 32766 },
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


test('signedSmallIntType decode tests', (assert) => {
  const field = new Field({ name: 'test', type: SignedSmallIntType.create() });
  const samples = [
    { input: -32768, output: -32768 },
    { input: 32767, output: 32767 },
    { input: -32767, output: -32767 },
    { input: 32766, output: 32766 },
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
