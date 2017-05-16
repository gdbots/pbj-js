import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import booleanType from '../../src/Type/booleanType';
import * as helpers from './helpers';

test('booleanType property tests', (assert) => {
  assert.true(booleanType instanceof Type);
  assert.same(booleanType.getTypeName(), TypeName.BOOLEAN);
  assert.same(booleanType.getTypeValue(), TypeName.BOOLEAN.valueOf());
  assert.same(booleanType.isScalar(), true);
  assert.same(booleanType.encodesToScalar(), true);
  assert.same(booleanType.getDefault(), false);
  assert.same(booleanType.isBoolean(), true);
  assert.same(booleanType.isBinary(), false);
  assert.same(booleanType.isNumeric(), false);
  assert.same(booleanType.isString(), false);
  assert.same(booleanType.isMessage(), false);
  assert.same(booleanType.allowedInSet(), false);

  try {
    booleanType.test = 1;
    assert.fail('booleanType instance is mutable');
  } catch (e) {
    assert.pass('booleanType instance is immutable');
  }

  assert.end();
});


test('booleanType guard tests', (assert) => {
  const field = new Field('test', booleanType);
  const valid = [true, false];
  const invalid = ['true', 'false', 1, 0, 'on', 'off', 'yes', 'no', '+', '-', null, [], {}, -1, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('booleanType encode tests', (assert) => {
  const field = new Field('test', booleanType);
  const samples = [
    { input: false, output: false },
    { input: '', output: false },
    { input: null, output: false },
    { input: undefined, output: false },
    { input: 0, output: false },
    { input: NaN, output: false },
    { input: true, output: true },
  ];

  helpers.encodeSamples(field, samples, assert);
  assert.end();
});


test('booleanType decode tests', (assert) => {
  const field = new Field('test', booleanType);
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

  helpers.decodeSamples(field, samples, assert);
  assert.end();
});
