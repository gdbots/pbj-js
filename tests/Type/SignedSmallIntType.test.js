import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import SignedSmallIntType from '../../src/Type/SignedSmallIntType';
import * as helpers from './helpers';

test('SignedSmallIntType property tests', (t) => {
  const signedSmallIntType = SignedSmallIntType.create();
  t.true(signedSmallIntType instanceof Type);
  t.true(signedSmallIntType instanceof SignedSmallIntType);
  t.same(signedSmallIntType, SignedSmallIntType.create());
  t.same(signedSmallIntType.getTypeName(), TypeName.SIGNED_SMALL_INT);
  t.same(signedSmallIntType.getTypeValue(), TypeName.SIGNED_SMALL_INT.valueOf());
  t.same(signedSmallIntType.isScalar(), true);
  t.same(signedSmallIntType.encodesToScalar(), true);
  t.same(signedSmallIntType.getDefault(), 0);
  t.same(signedSmallIntType.isBoolean(), false);
  t.same(signedSmallIntType.isBinary(), false);
  t.same(signedSmallIntType.isNumeric(), true);
  t.same(signedSmallIntType.isString(), false);
  t.same(signedSmallIntType.isMessage(), false);
  t.same(signedSmallIntType.allowedInSet(), true);
  t.same(signedSmallIntType.getMin(), -32768);
  t.same(signedSmallIntType.getMax(), 32767);

  try {
    signedSmallIntType.test = 1;
    t.fail('SignedSmallIntType instance is mutable');
  } catch (e) {
    t.pass('SignedSmallIntType instance is immutable');
  }

  t.end();
});


test('SignedSmallIntType guard tests', (t) => {
  const field = new Field({ name: 'test', type: SignedSmallIntType.create() });
  const valid = [0, -32768, 32767, -32767, 32766];
  const invalid = [-32769, 32768, '-32768', '32767', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('SignedSmallIntType encode tests', (t) => {
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

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('SignedSmallIntType decode tests', (t) => {
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

  helpers.decodeSamples(field, samples, t);
  t.end();
});
