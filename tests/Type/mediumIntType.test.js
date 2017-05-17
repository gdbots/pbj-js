import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import mediumIntType from '../../src/Type/mediumIntType';
import * as helpers from './helpers';

test('mediumIntType property tests', (assert) => {
  assert.true(mediumIntType instanceof Type);
  assert.same(mediumIntType.getTypeName(), TypeName.MEDIUM_INT);
  assert.same(mediumIntType.getTypeValue(), TypeName.MEDIUM_INT.valueOf());
  assert.same(mediumIntType.isScalar(), true);
  assert.same(mediumIntType.encodesToScalar(), true);
  assert.same(mediumIntType.getDefault(), 0);
  assert.same(mediumIntType.isBoolean(), false);
  assert.same(mediumIntType.isBinary(), false);
  assert.same(mediumIntType.isNumeric(), true);
  assert.same(mediumIntType.isString(), false);
  assert.same(mediumIntType.isMessage(), false);
  assert.same(mediumIntType.allowedInSet(), true);

  try {
    mediumIntType.test = 1;
    assert.fail('mediumIntType instance is mutable');
  } catch (e) {
    assert.pass('mediumIntType instance is immutable');
  }

  assert.end();
});


test('mediumIntType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: mediumIntType });
  const valid = [0, 16777215, 1, 16777214];
  const invalid = [-1, 16777216, '0', '16777215', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('mediumIntType encode tests', (assert) => {
  const field = new Field({ name: 'test', type: mediumIntType });
  const samples = [
    { input: 0, output: 0 },
    { input: 16777215, output: 16777215 },
    { input: 1, output: 1 },
    { input: 16777214, output: 16777214 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: 3.14, output: 3 },
    { input: '3.14', output: 3 },
  ];

  helpers.encodeSamples(field, samples, assert);
  assert.end();
});


test('mediumIntType decode tests', (assert) => {
  const field = new Field({ name: 'test', type: mediumIntType });
  const samples = [
    { input: 0, output: 0 },
    { input: 16777215, output: 16777215 },
    { input: 1, output: 1 },
    { input: 16777214, output: 16777214 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: 3.14, output: 3 },
    { input: '3.14', output: 3 },
  ];

  helpers.decodeSamples(field, samples, assert);
  assert.end();
});
