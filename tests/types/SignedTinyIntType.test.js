import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import SignedTinyIntType from '../../src/types/SignedTinyIntType';
import helpers from './helpers';

test('SignedTinyIntType property tests', (t) => {
  const signedTinyIntType = SignedTinyIntType.create();
  t.true(signedTinyIntType instanceof Type);
  t.true(signedTinyIntType instanceof SignedTinyIntType);
  t.same(signedTinyIntType, SignedTinyIntType.create());
  t.true(signedTinyIntType === SignedTinyIntType.create());
  t.same(signedTinyIntType.getTypeName(), TypeName.SIGNED_TINY_INT);
  t.same(signedTinyIntType.getTypeValue(), TypeName.SIGNED_TINY_INT.valueOf());
  t.same(signedTinyIntType.isScalar(), true);
  t.same(signedTinyIntType.encodesToScalar(), true);
  t.same(signedTinyIntType.getDefault(), 0);
  t.same(signedTinyIntType.isBoolean(), false);
  t.same(signedTinyIntType.isBinary(), false);
  t.same(signedTinyIntType.isNumeric(), true);
  t.same(signedTinyIntType.isString(), false);
  t.same(signedTinyIntType.isMessage(), false);
  t.same(signedTinyIntType.allowedInSet(), true);
  t.same(signedTinyIntType.getMin(), -128);
  t.same(signedTinyIntType.getMax(), 127);

  try {
    signedTinyIntType.test = 1;
    t.fail('signedTinyIntType instance is mutable');
  } catch (e) {
    t.pass('signedTinyIntType instance is immutable');
  }

  t.end();
});


test('SignedTinyIntType guard tests', (t) => {
  const field = new Field({ name: 'test', type: SignedTinyIntType.create() });
  const valid = [0, -128, 127, -127, 126];
  const invalid = [-129, 128, '-128', '127', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('SignedTinyIntType encode tests', (t) => {
  const field = new Field({ name: 'test', type: SignedTinyIntType.create() });
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

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('SignedTinyIntType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: SignedTinyIntType.create() });
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

  await helpers.decodeSamples(field, samples, t);
  t.end();
});
