import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import BooleanType from '../../src/Type/BooleanType';
import * as helpers from './helpers';

test('BooleanType property tests', (t) => {
  const booleanType = BooleanType.create();
  t.true(booleanType instanceof Type);
  t.true(booleanType instanceof BooleanType);
  t.same(booleanType, BooleanType.create());
  t.same(booleanType.getTypeName(), TypeName.BOOLEAN);
  t.same(booleanType.getTypeValue(), TypeName.BOOLEAN.valueOf());
  t.same(booleanType.isScalar(), true);
  t.same(booleanType.encodesToScalar(), true);
  t.same(booleanType.getDefault(), false);
  t.same(booleanType.isBoolean(), true);
  t.same(booleanType.isBinary(), false);
  t.same(booleanType.isNumeric(), false);
  t.same(booleanType.isString(), false);
  t.same(booleanType.isMessage(), false);
  t.same(booleanType.allowedInSet(), false);

  try {
    booleanType.test = 1;
    t.fail('booleanType instance is mutable');
  } catch (e) {
    t.pass('booleanType instance is immutable');
  }

  t.end();
});


test('BooleanType guard tests', (t) => {
  const field = new Field({ name: 'test', type: BooleanType.create() });
  const valid = [true, false];
  const invalid = ['true', 'false', 1, 0, 'on', 'off', 'yes', 'no', '+', '-', null, [], {}, -1, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('BooleanType encode tests', (t) => {
  const field = new Field({ name: 'test', type: BooleanType.create() });
  const samples = [
    { input: false, output: false },
    { input: '', output: false },
    { input: null, output: false },
    { input: undefined, output: false },
    { input: 0, output: false },
    { input: NaN, output: false },
    { input: true, output: true },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('BooleanType decode tests', (t) => {
  const field = new Field({ name: 'test', type: BooleanType.create() });
  const samples = [
    { input: false, output: false },
    { input: 'false', output: false },
    { input: 'FALSE', output: false },
    { input: 'False', output: false },
    { input: 'FaLSe', output: false },
    { input: '0', output: false },
    { input: '-1', output: false },
    { input: 'no', output: false },
    { input: 'null', output: false },
    { input: '', output: false },
    { input: 0, output: false },
    { input: -1, output: false },
    { input: null, output: false },
    { input: undefined, output: false },
    { input: {}, output: false },
    { input: [], output: false },
    { input: NaN, output: false },

    { input: true, output: true },
    { input: 'true', output: true },
    { input: 'TRUE', output: true },
    { input: 'True', output: true },
    { input: 'tRuE', output: true },
    { input: '1', output: true },
    { input: 'yes', output: true },
    { input: 'YES', output: true },
    { input: 'Yes', output: true },
    { input: 'yEs', output: true },
    { input: '+', output: true },
    { input: 'on', output: true },
    { input: 'ON', output: true },
    { input: 'On', output: true },
    { input: 1, output: true },
  ];

  helpers.decodeSamples(field, samples, t);
  t.end();
});
