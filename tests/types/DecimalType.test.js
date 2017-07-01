import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import DecimalType from '../../src/types/DecimalType';
import helpers from './helpers';

test('DecimalType property tests', (t) => {
  const decimalType = DecimalType.create();
  t.true(decimalType instanceof Type);
  t.true(decimalType instanceof DecimalType);
  t.same(decimalType, DecimalType.create());
  t.true(decimalType === DecimalType.create());
  t.same(decimalType.getTypeName(), TypeName.DECIMAL);
  t.same(decimalType.getTypeValue(), TypeName.DECIMAL.valueOf());
  t.same(decimalType.isScalar(), true);
  t.same(decimalType.encodesToScalar(), true);
  t.same(decimalType.getDefault(), 0.0);
  t.same(decimalType.isBoolean(), false);
  t.same(decimalType.isBinary(), false);
  t.same(decimalType.isNumeric(), true);
  t.same(decimalType.isString(), false);
  t.same(decimalType.isMessage(), false);
  t.same(decimalType.allowedInSet(), true);
  t.same(decimalType.getMin(), Number.MIN_VALUE);
  t.same(decimalType.getMax(), Number.MAX_VALUE);

  try {
    decimalType.test = 1;
    t.fail('decimalType instance is mutable');
  } catch (e) {
    t.pass('decimalType instance is immutable');
  }

  t.end();
});


test('DecimalType guard tests', (t) => {
  const field = new Field({ name: 'test', type: DecimalType.create() });
  const valid = [0.0, 3.14, -3.14, Number.MIN_VALUE, Number.MAX_VALUE];
  const invalid = ['0', '0.0', '3.14', '-3.14', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('DecimalType encode tests', (t) => {
  const field = new Field({ name: 'test', type: DecimalType.create() });
  const samples = [
    { input: 0.1, output: '0.10' },
    { input: 3.14159265358979, output: '3.14' },
    { input: -3.14159265358979, output: '-3.14' },
    { input: false, output: '0.00' },
    { input: '', output: '0.00' },
    { input: null, output: '0.00' },
    { input: undefined, output: '0.00' },
    { input: NaN, output: '0.00' },
    { input: '3.14159265358979', output: '3.14' },
    { input: '-3.14159265358979', output: '-3.14' },
  ];

  helpers.encodeSamples(field, samples, t);
  t.comment('test samples with scale of 6');

  const fieldWith6Scale = new Field({ name: 'test_6_scale', type: DecimalType.create(), precision: 10, scale: 6 });
  const samplesWith6Scale = [
    { input: 0.1, output: '0.100000' },
    { input: 1.1, output: '1.100000' },
    { input: 3.14159265358979, output: '3.141593' },
    { input: -3.14159265358979, output: '-3.141593' },
    { input: '3.14159265358979', output: '3.141593' },
    { input: '-3.14159265358979', output: '-3.141593' },
  ];

  helpers.encodeSamples(fieldWith6Scale, samplesWith6Scale, t);

  t.end();
});


test('DecimalType decode tests', (t) => {
  const field = new Field({ name: 'test', type: DecimalType.create() });
  const samples = [
    { input: 0, output: 0 },
    { input: 3.14159265358979, output: 3.14 },
    { input: -3.14159265358979, output: -3.14 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: '3.14159265358979', output: 3.14 },
    { input: '-3.14159265358979', output: -3.14 },
  ];

  helpers.decodeSamples(field, samples, t);

  const fieldWith6Scale = new Field({ name: 'test_6_scale', type: DecimalType.create(), precision: 10, scale: 6 });
  const samplesWith6Scale = [
    { input: '0.100000', output: 0.1 },
    { input: '1.100000', output: 1.1 },
    { input: 3.14159265358979, output: 3.141593 },
    { input: -3.14159265358979, output: -3.141593 },
    { input: false, output: 0 },
    { input: '', output: 0 },
    { input: null, output: 0 },
    { input: undefined, output: 0 },
    { input: NaN, output: 0 },
    { input: '3.14159265358979', output: 3.141593 },
    { input: '-3.14159265358979', output: -3.141593 },
  ];

  helpers.decodeSamples(fieldWith6Scale, samplesWith6Scale, t);

  t.end();
});
