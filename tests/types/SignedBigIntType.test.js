import test from 'tape';
import TypeName from '../../src/enums/TypeName.js';
import Type from '../../src/types/Type.js';
import Field from '../../src/Field.js';
import SignedBigIntType from '../../src/types/SignedBigIntType.js';
import BigNumber from '../../src/well-known/BigNumber.js';
import helpers from './helpers.js';

test('SignedBigIntType property tests', (t) => {
  const signedBigIntType = SignedBigIntType.create();
  t.true(signedBigIntType instanceof Type);
  t.true(signedBigIntType instanceof SignedBigIntType);
  t.same(signedBigIntType, SignedBigIntType.create());
  t.true(signedBigIntType === SignedBigIntType.create());
  t.same(signedBigIntType.getTypeName(), TypeName.SIGNED_BIG_INT);
  t.same(signedBigIntType.getTypeValue(), TypeName.SIGNED_BIG_INT.valueOf());
  t.same(signedBigIntType.isScalar(), false);
  t.same(signedBigIntType.encodesToScalar(), true);
  t.same(signedBigIntType.getDefault(), new BigNumber(0));
  t.same(signedBigIntType.isBoolean(), false);
  t.same(signedBigIntType.isBinary(), false);
  t.same(signedBigIntType.isNumeric(), true);
  t.same(signedBigIntType.isString(), false);
  t.same(signedBigIntType.isMessage(), false);
  t.same(signedBigIntType.allowedInSet(), true);

  try {
    signedBigIntType.test = 1;
    t.fail('SignedBigIntType instance is mutable');
  } catch (e) {
    t.pass('SignedBigIntType instance is immutable');
  }

  t.end();
});


test('SignedBigIntType guard tests', (t) => {
  const field = new Field({ name: 'test', type: SignedBigIntType.create() });
  const valid = [
    new BigNumber(0),
    new BigNumber('-9223372036854775808'),
    new BigNumber('-9223372036854775807'),
    new BigNumber('9223372036854775807'),
    new BigNumber('9223372036854775806'),
  ];
  const invalid = [
    -1,
    new BigNumber('-9223372036854775809'),
    new BigNumber('9223372036854775808'),
    '0',
    '1',
    '2',
    null,
    [],
    {},
    '',
    NaN,
    undefined,
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('SignedBigIntType encode tests', (t) => {
  const field = new Field({ name: 'test', type: SignedBigIntType.create() });
  const samples = [
    { input: new BigNumber('-9223372036854775808'), output: '-9223372036854775808' },
    { input: new BigNumber('-9223372036854775807.111'), output: '-9223372036854775807' },
    { input: new BigNumber('9223372036854775807'), output: '9223372036854775807' },
    { input: new BigNumber('9223372036854775806.111'), output: '9223372036854775806' },
    { input: new BigNumber(1), output: '1' },
    { input: new BigNumber(1.44444), output: '1' },
    { input: 0, output: '0' },
    { input: 1, output: '0' },
    { input: 2, output: '0' },
    { input: false, output: '0' },
    { input: '', output: '0' },
    { input: null, output: '0' },
    { input: undefined, output: '0' },
    { input: NaN, output: '0' },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('SignedBigIntType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: SignedBigIntType.create() });
  const samples = [
    { input: '-9223372036854775808', output: new BigNumber('-9223372036854775808') },
    { input: '-9223372036854775807', output: new BigNumber('-9223372036854775807') },
    { input: '9223372036854775807', output: new BigNumber('9223372036854775807') },
    { input: '9223372036854775806', output: new BigNumber('9223372036854775806') },
    { input: '0', output: new BigNumber('0') },
    { input: '0', output: new BigNumber(0) },
    { input: new BigNumber(1), output: new BigNumber(1) },
    { input: null, output: null },
  ];

  await helpers.decodeSamples(field, samples, t);
  t.end();
});
