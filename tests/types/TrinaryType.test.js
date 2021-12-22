import test from 'tape';
import TypeName from '../../src/enums/TypeName.js';
import Type from '../../src/types/Type.js';
import Field from '../../src/Field.js';
import TrinaryType from '../../src/types/TrinaryType.js';
import helpers from './helpers.js';

test('TrinaryType property tests', (t) => {
  const trinaryType = TrinaryType.create();
  t.true(trinaryType instanceof Type);
  t.true(trinaryType instanceof TrinaryType);
  t.same(trinaryType, TrinaryType.create());
  t.true(trinaryType === TrinaryType.create());
  t.same(trinaryType.getTypeName(), TypeName.TRINARY);
  t.same(trinaryType.getTypeValue(), TypeName.TRINARY.valueOf());
  t.same(trinaryType.isScalar(), true);
  t.same(trinaryType.encodesToScalar(), true);
  t.same(trinaryType.getDefault(), 0);
  t.same(trinaryType.isBoolean(), false);
  t.same(trinaryType.isBinary(), false);
  t.same(trinaryType.isNumeric(), true);
  t.same(trinaryType.isString(), false);
  t.same(trinaryType.isMessage(), false);
  t.same(trinaryType.allowedInSet(), false);
  t.same(trinaryType.getMin(), 0);
  t.same(trinaryType.getMax(), 2);

  try {
    trinaryType.test = 1;
    t.fail('trinaryType instance is mutable');
  } catch (e) {
    t.pass('trinaryType instance is immutable');
  }

  t.end();
});


test('TrinaryType guard tests', (t) => {
  const field = new Field({ name: 'test', type: TrinaryType.create() });
  const valid = [0, 1, 2];
  const invalid = [-1, 3, '0', '1', '2', true, false, null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('TrinaryType encode tests', (t) => {
  const field = new Field({ name: 'test', type: TrinaryType.create() });
  const samples = [
    { input: 0, output: 0 },
    { input: 1, output: 1 },
    { input: 2, output: 2 },
    { input: '0', output: 0 },
    { input: '1', output: 1 },
    { input: '2', output: 2 },
    { input: false, output: 0 },
    { input: true, output: 1 }, // this is weird, true becomes 1 in _.toSafeInteger
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('TrinaryType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: TrinaryType.create() });
  const samples = [
    { input: 0, output: 0 },
    { input: 1, output: 1 },
    { input: 2, output: 2 },
    { input: '0', output: 0 },
    { input: '1', output: 1 },
    { input: '2', output: 2 },
    { input: false, output: 0 },
    { input: true, output: 1 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
  ];

  await helpers.decodeSamples(field, samples, t);
  t.end();
});
