import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import TimestampType from '../../src/Type/TimestampType';
import * as helpers from './helpers';

test('timestampType property tests', (assert) => {
  const timestampType = TimestampType.create();
  assert.true(timestampType instanceof Type);
  assert.true(timestampType instanceof TimestampType);
  assert.same(timestampType, TimestampType.create());
  assert.same(timestampType.getTypeName(), TypeName.TIMESTAMP);
  assert.same(timestampType.getTypeValue(), TypeName.TIMESTAMP.valueOf());
  assert.same(timestampType.isScalar(), true);
  assert.same(timestampType.encodesToScalar(), true);
  assert.same(timestampType.getDefault(), Math.floor(Date.now() / 1000));
  assert.same(timestampType.isBoolean(), false);
  assert.same(timestampType.isBinary(), false);
  assert.same(timestampType.isNumeric(), true);
  assert.same(timestampType.isString(), false);
  assert.same(timestampType.isMessage(), false);
  assert.same(timestampType.allowedInSet(), true);

  try {
    timestampType.test = 1;
    assert.fail('timestampType instance is mutable');
  } catch (e) {
    assert.pass('timestampType instance is immutable');
  }

  assert.end();
});


test('timestampType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: TimestampType.create() });
  const valid = [1451001600, 1495053313];
  const invalid = [-1, '1451001600', '1495053313', true, false, null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('timestampType encode tests', (assert) => {
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

  helpers.encodeSamples(field, samples, assert);
  assert.end();
});


test('timestampType decode tests', (assert) => {
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

  helpers.decodeSamples(field, samples, assert);
  assert.end();
});
