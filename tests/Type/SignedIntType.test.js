import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import SignedIntType from '../../src/Type/SignedIntType';
import * as helpers from './helpers';

test('SignedIntType property tests', (t) => {
  const signedIntType = SignedIntType.create();
  t.true(signedIntType instanceof Type);
  t.true(signedIntType instanceof SignedIntType);
  t.same(signedIntType, SignedIntType.create());
  t.same(signedIntType.getTypeName(), TypeName.SIGNED_INT);
  t.same(signedIntType.getTypeValue(), TypeName.SIGNED_INT.valueOf());
  t.same(signedIntType.isScalar(), true);
  t.same(signedIntType.encodesToScalar(), true);
  t.same(signedIntType.getDefault(), 0);
  t.same(signedIntType.isBoolean(), false);
  t.same(signedIntType.isBinary(), false);
  t.same(signedIntType.isNumeric(), true);
  t.same(signedIntType.isString(), false);
  t.same(signedIntType.isMessage(), false);
  t.same(signedIntType.allowedInSet(), true);

  try {
    signedIntType.test = 1;
    t.fail('signedIntType instance is mutable');
  } catch (e) {
    t.pass('signedIntType instance is immutable');
  }

  t.end();
});


test('SignedIntType guard tests', (t) => {
  const field = new Field({ name: 'test', type: SignedIntType.create() });
  const valid = [0, -2147483648, 2147483647, -2147483647, 2147483646];
  const invalid = [-2147483649, 2147483648, '-2147483648', '2147483647', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('SignedIntType encode tests', (t) => {
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

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('SignedIntType decode tests', (t) => {
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

  helpers.decodeSamples(field, samples, t);
  t.end();
});
