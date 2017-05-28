import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import TinyIntType from '../../src/Type/TinyIntType';
import * as helpers from './helpers';

test('TinyIntType property tests', (t) => {
  const tinyIntType = TinyIntType.create();
  t.true(tinyIntType instanceof Type);
  t.true(tinyIntType instanceof TinyIntType);
  t.same(tinyIntType, TinyIntType.create());
  t.same(tinyIntType.getTypeName(), TypeName.TINY_INT);
  t.same(tinyIntType.getTypeValue(), TypeName.TINY_INT.valueOf());
  t.same(tinyIntType.isScalar(), true);
  t.same(tinyIntType.encodesToScalar(), true);
  t.same(tinyIntType.getDefault(), 0);
  t.same(tinyIntType.isBoolean(), false);
  t.same(tinyIntType.isBinary(), false);
  t.same(tinyIntType.isNumeric(), true);
  t.same(tinyIntType.isString(), false);
  t.same(tinyIntType.isMessage(), false);
  t.same(tinyIntType.allowedInSet(), true);
  t.same(tinyIntType.getMin(), 0);
  t.same(tinyIntType.getMax(), 255);

  try {
    tinyIntType.test = 1;
    t.fail('TinyIntType instance is mutable');
  } catch (e) {
    t.pass('TinyIntType instance is immutable');
  }

  t.end();
});


test('TinyIntType guard tests', (t) => {
  const field = new Field({ name: 'test', type: TinyIntType.create() });
  const valid = [0, 255, 1, 254];
  const invalid = [-1, 256, '0', '255', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('TinyIntType encode tests', (t) => {
  const field = new Field({ name: 'test', type: TinyIntType.create() });
  const samples = [
    { input: 0, output: 0 },
    { input: 255, output: 255 },
    { input: 1, output: 1 },
    { input: 254, output: 254 },
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


test('TinyIntType decode tests', (t) => {
  const field = new Field({ name: 'test', type: TinyIntType.create() });
  const samples = [
    { input: 0, output: 0 },
    { input: 255, output: 255 },
    { input: 1, output: 1 },
    { input: 254, output: 254 },
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
