import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import DateType from '../../src/Type/DateType';
import * as helpers from './helpers';

test('DateType property tests', (t) => {
  const dateType = DateType.create();
  t.true(dateType instanceof Type);
  t.true(dateType instanceof DateType);
  t.same(dateType, DateType.create());
  t.same(dateType.getTypeName(), TypeName.DATE);
  t.same(dateType.getTypeValue(), TypeName.DATE.valueOf());
  t.same(dateType.isScalar(), false);
  t.same(dateType.encodesToScalar(), true);
  t.same(dateType.getDefault(), null);
  t.same(dateType.isBoolean(), false);
  t.same(dateType.isBinary(), false);
  t.same(dateType.isNumeric(), false);
  t.same(dateType.isString(), true);
  t.same(dateType.isMessage(), false);
  t.same(dateType.allowedInSet(), false);

  try {
    dateType.test = 1;
    t.fail('DateType instance is mutable');
  } catch (e) {
    t.pass('DateType instance is immutable');
  }

  t.end();
});


test('DateType guard tests', (t) => {
  const field = new Field({ name: 'test', type: DateType.create() });
  const valid = [
    new Date(2015, 11, 25),
    new Date('2015-12-25'),
  ];
  const invalid = [
    '2015-12-25',
    null,
    [],
    {},
    '',
    NaN,
    undefined,
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('DateType encode tests', (t) => {
  const field = new Field({ name: 'test', type: DateType.create() });
  const samples = [
    { input: new Date(2015, 11, 25), output: '2015-12-25' },
    { input: 0, output: null },
    { input: 1, output: null },
    { input: 2, output: null },
    { input: false, output: null },
    { input: '', output: null },
    { input: null, output: null },
    { input: undefined, output: null },
    { input: NaN, output: null },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('DateType decode tests', (t) => {
  const field = new Field({ name: 'test', type: DateType.create() });
  const date = new Date(Date.UTC(2015, 11, 25));
  const samples = [
    { input: '2015-12-25T07:30:45.123Z', output: date },
    { input: '2015-12-25T07:30:45.123+08:00', output: date },
    { input: '2015-12-25T07:30:45.123+0800', output: date },
    { input: '2015-12-25', output: date },
    { input: date, output: date },
    { input: null, output: null },
  ];

  function format(d) {
    return d instanceof Date ? d.toISOString().substr(0, 10) : d;
  }

  samples.forEach((obj) => {
    try {
      const actual = field.getType().decode(obj.input, field);
      t.same(format(actual), format(obj.output));
    } catch (e) {
      t.fail(e.message);
    }
  });

  t.end();
});


test('DateType decode(invalid) tests', (t) => {
  const field = new Field({ name: 'test', type: DateType.create() });
  const samples = ['nope', '12/25/2015', false, [], {}, '', NaN, undefined];
  helpers.decodeInvalidSamples(field, samples, t);
  t.end();
});
