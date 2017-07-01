import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import IntType from '../../src/types/IntType';
import helpers from './helpers';

test('IntType property tests', (t) => {
  const intType = IntType.create();
  t.true(intType instanceof Type);
  t.true(intType instanceof IntType);
  t.same(intType, IntType.create());
  t.true(intType === IntType.create());
  t.same(intType.getTypeName(), TypeName.INT);
  t.same(intType.getTypeValue(), TypeName.INT.valueOf());
  t.same(intType.isScalar(), true);
  t.same(intType.encodesToScalar(), true);
  t.same(intType.getDefault(), 0);
  t.same(intType.isBoolean(), false);
  t.same(intType.isBinary(), false);
  t.same(intType.isNumeric(), true);
  t.same(intType.isString(), false);
  t.same(intType.isMessage(), false);
  t.same(intType.allowedInSet(), true);
  t.same(intType.getMin(), 0);
  t.same(intType.getMax(), 4294967295);

  try {
    intType.test = 1;
    t.fail('intType instance is mutable');
  } catch (e) {
    t.pass('intType instance is immutable');
  }

  t.end();
});


test('IntType guard tests', (t) => {
  const field = new Field({ name: 'test', type: IntType.create() });
  const valid = [0, 4294967295, 1, 4294967294];
  const invalid = [-1, 4294967296, '0', '4294967295', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('IntType guard (min/max) tests', (t) => {
  const field = new Field({ name: 'test', type: IntType.create(), min: 5, max: 10 });
  const valid = [5, 6, 10, 9];
  const invalid = [4, 11];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('IntType encode tests', (t) => {
  const field = new Field({ name: 'test', type: IntType.create() });
  const samples = [
    { input: 0, output: 0 },
    { input: 4294967295, output: 4294967295 },
    { input: 1, output: 1 },
    { input: 4294967294, output: 4294967294 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: 3.14, output: 3 },
    { input: '3.14', output: 3 },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('IntType decode tests', (t) => {
  const field = new Field({ name: 'test', type: IntType.create() });
  const samples = [
    { input: 0, output: 0 },
    { input: 4294967295, output: 4294967295 },
    { input: 1, output: 1 },
    { input: 4294967294, output: 4294967294 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: 3.14, output: 3 },
    { input: '3.14', output: 3 },
  ];

  helpers.decodeSamples(field, samples, t);
  t.end();
});
