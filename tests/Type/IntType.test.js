import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import IntType from '../../src/Type/IntType';
import * as helpers from './helpers';

test('IntType property tests', (t) => {
  const intType = IntType.create();
  t.true(intType instanceof Type);
  t.true(intType instanceof IntType);
  t.same(intType, IntType.create());
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
