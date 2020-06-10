import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import SignedMediumIntType from '../../src/types/SignedMediumIntType';
import helpers from './helpers';

test('SignedMediumIntType property tests', (t) => {
  const signedMediumIntType = SignedMediumIntType.create();
  t.true(signedMediumIntType instanceof Type);
  t.true(signedMediumIntType instanceof SignedMediumIntType);
  t.same(signedMediumIntType, SignedMediumIntType.create());
  t.true(signedMediumIntType === SignedMediumIntType.create());
  t.same(signedMediumIntType.getTypeName(), TypeName.SIGNED_MEDIUM_INT);
  t.same(signedMediumIntType.getTypeValue(), TypeName.SIGNED_MEDIUM_INT.valueOf());
  t.same(signedMediumIntType.isScalar(), true);
  t.same(signedMediumIntType.encodesToScalar(), true);
  t.same(signedMediumIntType.getDefault(), 0);
  t.same(signedMediumIntType.isBoolean(), false);
  t.same(signedMediumIntType.isBinary(), false);
  t.same(signedMediumIntType.isNumeric(), true);
  t.same(signedMediumIntType.isString(), false);
  t.same(signedMediumIntType.isMessage(), false);
  t.same(signedMediumIntType.allowedInSet(), true);
  t.same(signedMediumIntType.getMin(), -8388608);
  t.same(signedMediumIntType.getMax(), 8388607);

  try {
    signedMediumIntType.test = 1;
    t.fail('signedMediumIntType instance is mutable');
  } catch (e) {
    t.pass('signedMediumIntType instance is immutable');
  }

  t.end();
});


test('SignedMediumIntType guard tests', (t) => {
  const field = new Field({ name: 'test', type: SignedMediumIntType.create() });
  const valid = [0, -8388608, 8388607, -8388607, 8388606];
  const invalid = [-8388609, 8388608, '-8388608', '8388607', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('SignedMediumIntType encode tests', (t) => {
  const field = new Field({ name: 'test', type: SignedMediumIntType.create() });
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

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('SignedMediumIntType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: SignedMediumIntType.create() });
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

  await helpers.decodeSamples(field, samples, t);
  t.end();
});
