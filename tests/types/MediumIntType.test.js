import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import MediumIntType from '../../src/types/MediumIntType';
import helpers from './helpers';

test('MediumIntType property tests', (t) => {
  const mediumIntType = MediumIntType.create();
  t.true(mediumIntType instanceof Type);
  t.true(mediumIntType instanceof MediumIntType);
  t.same(mediumIntType, MediumIntType.create());
  t.true(mediumIntType === MediumIntType.create());
  t.same(mediumIntType.getTypeName(), TypeName.MEDIUM_INT);
  t.same(mediumIntType.getTypeValue(), TypeName.MEDIUM_INT.valueOf());
  t.same(mediumIntType.isScalar(), true);
  t.same(mediumIntType.encodesToScalar(), true);
  t.same(mediumIntType.getDefault(), 0);
  t.same(mediumIntType.isBoolean(), false);
  t.same(mediumIntType.isBinary(), false);
  t.same(mediumIntType.isNumeric(), true);
  t.same(mediumIntType.isString(), false);
  t.same(mediumIntType.isMessage(), false);
  t.same(mediumIntType.allowedInSet(), true);
  t.same(mediumIntType.getMin(), 0);
  t.same(mediumIntType.getMax(), 16777215);

  try {
    mediumIntType.test = 1;
    t.fail('mediumIntType instance is mutable');
  } catch (e) {
    t.pass('mediumIntType instance is immutable');
  }

  t.end();
});


test('MediumIntType guard tests', (t) => {
  const field = new Field({ name: 'test', type: MediumIntType.create() });
  const valid = [0, 16777215, 1, 16777214];
  const invalid = [-1, 16777216, '0', '16777215', null, [], {}, '', NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('MediumIntType encode tests', (t) => {
  const field = new Field({ name: 'test', type: MediumIntType.create() });
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

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('MediumIntType decode tests', (t) => {
  const field = new Field({ name: 'test', type: MediumIntType.create() });
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

  helpers.decodeSamples(field, samples, t);
  t.end();
});
