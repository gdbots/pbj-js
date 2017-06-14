import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import DateTimeType from '../../src/Type/DateTimeType';
import * as helpers from './helpers';

test('DateTimeType property tests', (t) => {
  const dateTimeType = DateTimeType.create();
  t.true(dateTimeType instanceof Type);
  t.true(dateTimeType instanceof DateTimeType);
  t.same(dateTimeType, DateTimeType.create());
  t.true(dateTimeType === DateTimeType.create());
  t.same(dateTimeType.getTypeName(), TypeName.DATE_TIME);
  t.same(dateTimeType.getTypeValue(), TypeName.DATE_TIME.valueOf());
  t.same(dateTimeType.isScalar(), false);
  t.same(dateTimeType.encodesToScalar(), true);
  t.same(dateTimeType.getDefault(), null);
  t.same(dateTimeType.isBoolean(), false);
  t.same(dateTimeType.isBinary(), false);
  t.same(dateTimeType.isNumeric(), false);
  t.same(dateTimeType.isString(), true);
  t.same(dateTimeType.isMessage(), false);
  t.same(dateTimeType.allowedInSet(), false);

  try {
    dateTimeType.test = 1;
    t.fail('DateTimeType instance is mutable');
  } catch (e) {
    t.pass('DateTimeType instance is immutable');
  }

  t.end();
});


test('DateTimeType guard tests', (t) => {
  const field = new Field({ name: 'test', type: DateTimeType.create() });
  const valid = [
    new Date('2015-12-25T07:30:45.123Z'),
    new Date('2015-12-25T07:30:45.123+08:00'),
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


test('DateTimeType encode tests', (t) => {
  const field = new Field({ name: 'test', type: DateTimeType.create() });
  const samples = [
    {
      input: new Date('2015-12-25T07:30:45.123Z'),
      output: '2015-12-25T07:30:45.123Z',
    },
    {
      input: new Date('2015-12-25T07:30:45.123+08:00'),
      output: '2015-12-24T23:30:45.123Z',
    },
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


test('DateTimeType decode tests', (t) => {
  const field = new Field({ name: 'test', type: DateTimeType.create() });
  const date = new Date(Date.UTC(2015, 11, 25, 12, 30, 45, 123));
  const samples = [
    {
      input: '2015-12-25T07:30:45.123Z',
      output: new Date('2015-12-25T07:30:45.123Z'),
    },
    {
      input: '2015-12-25T07:30:45.123+08:00',
      output: new Date('2015-12-24T23:30:45.123Z'),
    },
    {
      input: '2015-12-25T07:30:45.123+0800',
      output: new Date('2015-12-24T23:30:45.123Z'),
    },
    { input: date, output: date },
    { input: null, output: null },
  ];

  function format(d) {
    return d instanceof Date ? d.toISOString() : d;
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


test('DateTimeType decode(invalid) tests', (t) => {
  const field = new Field({ name: 'test', type: DateTimeType.create() });
  const samples = ['nope', '12/25/2015', false, [], {}, '', NaN, undefined];
  helpers.decodeInvalidSamples(field, samples, t);
  t.end();
});
