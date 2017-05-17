import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import trinaryType from '../../src/Type/trinaryType';
import * as helpers from './helpers';

test('trinaryType property tests', (assert) => {
  assert.true(trinaryType instanceof Type);
  assert.same(trinaryType.getTypeName(), TypeName.TRINARY);
  assert.same(trinaryType.getTypeValue(), TypeName.TRINARY.valueOf());
  assert.same(trinaryType.isScalar(), true);
  assert.same(trinaryType.encodesToScalar(), true);
  assert.same(trinaryType.getDefault(), 0);
  assert.same(trinaryType.isBoolean(), false);
  assert.same(trinaryType.isBinary(), false);
  assert.same(trinaryType.isNumeric(), true);
  assert.same(trinaryType.isString(), false);
  assert.same(trinaryType.isMessage(), false);
  assert.same(trinaryType.allowedInSet(), false);

  try {
    trinaryType.test = 1;
    assert.fail('trinaryType instance is mutable');
  } catch (e) {
    assert.pass('trinaryType instance is immutable');
  }

  assert.end();
});


test('trinaryType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: trinaryType });
  const valid = [0, 1, 2];
  const invalid = [-1, 3, '0', '1', '2', true, false, null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('trinaryType encode tests', (assert) => {
  const field = new Field({ name: 'test', type: trinaryType });
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

  helpers.encodeSamples(field, samples, assert);
  assert.end();
});


test('trinaryType decode tests', (assert) => {
  const field = new Field({ name: 'test', type: trinaryType });
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

  helpers.decodeSamples(field, samples, assert);
  assert.end();
});
