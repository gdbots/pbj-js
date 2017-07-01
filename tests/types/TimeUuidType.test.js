import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import TimeUuidType from '../../src/types/TimeUuidType';
import TimeUuidIdentifier from '../../src/well-known/TimeUuidIdentifier';
import SampleTimeUuidIdentifier from '../fixtures/well-known/SampleTimeUuidIdentifier';
import helpers from './helpers';

test('TimeUuidType property tests', (t) => {
  const timeUuidType = TimeUuidType.create();
  t.true(timeUuidType instanceof Type);
  t.true(timeUuidType instanceof TimeUuidType);
  t.same(timeUuidType, TimeUuidType.create());
  t.true(timeUuidType === TimeUuidType.create());
  t.same(timeUuidType.getTypeName(), TypeName.TIME_UUID);
  t.same(timeUuidType.getTypeValue(), TypeName.TIME_UUID.valueOf());
  t.same(timeUuidType.isScalar(), false);
  t.same(timeUuidType.encodesToScalar(), true);
  t.true(timeUuidType.getDefault() instanceof TimeUuidIdentifier);
  t.same(timeUuidType.isBoolean(), false);
  t.same(timeUuidType.isBinary(), false);
  t.same(timeUuidType.isNumeric(), false);
  t.same(timeUuidType.isString(), true);
  t.same(timeUuidType.isMessage(), false);
  t.same(timeUuidType.allowedInSet(), true);

  try {
    timeUuidType.test = 1;
    t.fail('TimeUuidType instance is mutable');
  } catch (e) {
    t.pass('TimeUuidType instance is immutable');
  }

  t.end();
});


test('TimeUuidType guard tests', (t) => {
  const field = new Field({ name: 'test', type: TimeUuidType.create(), classProto: SampleTimeUuidIdentifier });
  const valid = [
    SampleTimeUuidIdentifier.generate(),
    SampleTimeUuidIdentifier.fromString('b385af9a-4413-11e7-a919-92ebcb67fe33'),
    new SampleTimeUuidIdentifier('b385af9a-4413-11e7-a919-92ebcb67fe33'),
  ];
  const invalid = [
    TimeUuidIdentifier.generate(),
    'b385af9a-4413-11e7-a919-92ebcb67fe33',
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


test('TimeUuidType encode tests', (t) => {
  const field = new Field({ name: 'test', type: TimeUuidType.create(), classProto: SampleTimeUuidIdentifier });
  const id = SampleTimeUuidIdentifier.generate();
  const samples = [
    {
      input: SampleTimeUuidIdentifier.fromString('b385af9a-4413-11e7-a919-92ebcb67fe33'),
      output: 'b385af9a-4413-11e7-a919-92ebcb67fe33',
    },
    { input: id, output: id.toString() },
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


test('TimeUuidType decode tests', (t) => {
  const field = new Field({ name: 'test', type: TimeUuidType.create(), classProto: SampleTimeUuidIdentifier });
  const id = SampleTimeUuidIdentifier.generate();
  const samples = [
    {
      input: 'b385af9a-4413-11e7-a919-92ebcb67fe33',
      output: SampleTimeUuidIdentifier.fromString('b385af9a-4413-11e7-a919-92ebcb67fe33'),
    },
    { input: id.toString(), output: id },
    { input: id, output: id },
    { input: null, output: null },
  ];

  helpers.decodeSamples(field, samples, t);
  t.end();
});


test('TimeUuidType decode(invalid) tests', (t) => {
  const field = new Field({ name: 'test', type: TimeUuidType.create(), classProto: SampleTimeUuidIdentifier });
  const samples = [
    'nope',
    '4b268351-2445-4d98-a777-b461330d5c7f',
    'b385af9a-4413-11e7-a919-92ebcb67fe33X',
    false,
    [],
    {},
    '',
    NaN,
    undefined,
  ];
  helpers.decodeInvalidSamples(field, samples, t);
  t.end();
});
