import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import SmallIntType from '../../src/Type/SmallIntType';
import * as helpers from './helpers';

test('SmallIntType property tests', (t) => {
  const smallIntType = SmallIntType.create();
  t.true(smallIntType instanceof Type);
  t.true(smallIntType instanceof SmallIntType);
  t.same(smallIntType, SmallIntType.create());
  t.same(smallIntType.getTypeName(), TypeName.SMALL_INT);
  t.same(smallIntType.getTypeValue(), TypeName.SMALL_INT.valueOf());
  t.same(smallIntType.isScalar(), true);
  t.same(smallIntType.encodesToScalar(), true);
  t.same(smallIntType.getDefault(), 0);
  t.same(smallIntType.isBoolean(), false);
  t.same(smallIntType.isBinary(), false);
  t.same(smallIntType.isNumeric(), true);
  t.same(smallIntType.isString(), false);
  t.same(smallIntType.isMessage(), false);
  t.same(smallIntType.allowedInSet(), true);
  t.same(smallIntType.getMin(), 0);
  t.same(smallIntType.getMax(), 65535);

  try {
    smallIntType.test = 1;
    t.fail('SmallIntType instance is mutable');
  } catch (e) {
    t.pass('SmallIntType instance is immutable');
  }

  t.end();
});


test('SmallIntType guard tests', (t) => {
  const field = new Field({ name: 'test', type: SmallIntType.create() });
  const valid = [0, 65535, 1, 65534];
  const invalid = [-1, 65536, '0', '65535', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('SmallIntType encode tests', (t) => {
  const field = new Field({ name: 'test', type: SmallIntType.create() });
  const samples = [
    { input: 0, output: 0 },
    { input: 65535, output: 65535 },
    { input: 1, output: 1 },
    { input: 65534, output: 65534 },
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


test('SmallIntType decode tests', (t) => {
  const field = new Field({ name: 'test', type: SmallIntType.create() });
  const samples = [
    { input: 0, output: 0 },
    { input: 65535, output: 65535 },
    { input: 1, output: 1 },
    { input: 65534, output: 65534 },
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
