import test from 'tape';
import TypeName from '../../src/enums/TypeName.js';
import Type from '../../src/types/Type.js';
import Field from '../../src/Field.js';
import TimestampType from '../../src/types/TimestampType.js';
import helpers from './helpers.js';

test('TimestampType property tests', (t) => {
  const timestampType = TimestampType.create();
  t.true(timestampType instanceof Type);
  t.true(timestampType instanceof TimestampType);
  t.same(timestampType, TimestampType.create());
  t.true(timestampType === TimestampType.create());
  t.same(timestampType.getTypeName(), TypeName.TIMESTAMP);
  t.same(timestampType.getTypeValue(), TypeName.TIMESTAMP.valueOf());
  t.same(timestampType.isScalar(), true);
  t.same(timestampType.encodesToScalar(), true);
  t.same(timestampType.getDefault(), Math.floor(Date.now() / 1000));
  t.same(timestampType.isBoolean(), false);
  t.same(timestampType.isBinary(), false);
  t.same(timestampType.isNumeric(), true);
  t.same(timestampType.isString(), false);
  t.same(timestampType.isMessage(), false);
  t.same(timestampType.allowedInSet(), true);

  try {
    timestampType.test = 1;
    t.fail('TimestampType instance is mutable');
  } catch (e) {
    t.pass('TimestampType instance is immutable');
  }

  t.end();
});


test('TimestampType guard tests', (t) => {
  const field = new Field({ name: 'test', type: TimestampType.create() });
  const valid = [1451001600, 1495053313];
  const invalid = [-1, '1451001600', '1495053313', true, false, null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('TimestampType encode tests', (t) => {
  const field = new Field({ name: 'test', type: TimestampType.create() });
  const samples = [
    { input: 1451001600, output: 1451001600 },
    { input: 1495053313, output: 1495053313 },
    { input: '1451001600', output: 1451001600 },
    { input: '1495053313', output: 1495053313 },
    { input: false, output: 0 },
    { input: true, output: 1 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('TimestampType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: TimestampType.create() });
  const samples = [
    { input: 1451001600, output: 1451001600 },
    { input: 1495053313, output: 1495053313 },
    { input: '1451001600', output: 1451001600 },
    { input: '1495053313', output: 1495053313 },
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
