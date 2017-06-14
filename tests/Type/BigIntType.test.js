import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import BigIntType from '../../src/Type/BigIntType';
import BigNumber from '../../src/WellKnown/BigNumber';
import * as helpers from './helpers';

test('BigIntType property tests', (t) => {
  const bigIntType = BigIntType.create();
  t.true(bigIntType instanceof Type);
  t.true(bigIntType instanceof BigIntType);
  t.same(bigIntType, BigIntType.create());
  t.true(bigIntType === BigIntType.create());
  t.same(bigIntType.getTypeName(), TypeName.BIG_INT);
  t.same(bigIntType.getTypeValue(), TypeName.BIG_INT.valueOf());
  t.same(bigIntType.isScalar(), false);
  t.same(bigIntType.encodesToScalar(), true);
  t.same(bigIntType.getDefault(), new BigNumber(0));
  t.same(bigIntType.isBoolean(), false);
  t.same(bigIntType.isBinary(), false);
  t.same(bigIntType.isNumeric(), true);
  t.same(bigIntType.isString(), false);
  t.same(bigIntType.isMessage(), false);
  t.same(bigIntType.allowedInSet(), true);

  try {
    bigIntType.test = 1;
    t.fail('BigIntType instance is mutable');
  } catch (e) {
    t.pass('BigIntType instance is immutable');
  }

  t.end();
});


test('BigIntType guard tests', (t) => {
  const field = new Field({ name: 'test', type: BigIntType.create() });
  const valid = [
    new BigNumber(0),
    new BigNumber('18446744073709551615'),
  ];
  const invalid = [
    -1,
    new BigNumber('-1'),
    new BigNumber('18446744073709551616'),
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


test('BigIntType encode tests', (t) => {
  const field = new Field({ name: 'test', type: BigIntType.create() });
  const samples = [
    { input: new BigNumber('18446744073709551615'), output: '18446744073709551615' },
    { input: new BigNumber('18446744073709551610.555'), output: '18446744073709551611' },
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


test('BigIntType decode tests', (t) => {
  const field = new Field({ name: 'test', type: BigIntType.create() });
  const samples = [
    { input: '18446744073709551615', output: new BigNumber('18446744073709551615') },
    { input: '1', output: new BigNumber('1') },
    { input: '0', output: new BigNumber('0') },
    { input: '0', output: new BigNumber(0) },
    { input: new BigNumber(1), output: new BigNumber(1) },
    { input: null, output: null },
  ];

  helpers.decodeSamples(field, samples, t);
  t.end();
});
