import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import UuidType from '../../src/types/UuidType';
import UuidIdentifier from '../../src/well-known/UuidIdentifier';
import SampleUuidIdentifier from '../fixtures/well-known/SampleUuidIdentifier';
import helpers from './helpers';

test('UuidType property tests', (t) => {
  const uuidType = UuidType.create();
  t.true(uuidType instanceof Type);
  t.true(uuidType instanceof UuidType);
  t.same(uuidType, UuidType.create());
  t.true(uuidType === UuidType.create());
  t.same(uuidType.getTypeName(), TypeName.UUID);
  t.same(uuidType.getTypeValue(), TypeName.UUID.valueOf());
  t.same(uuidType.isScalar(), false);
  t.same(uuidType.encodesToScalar(), true);
  t.true(uuidType.getDefault() instanceof UuidIdentifier);
  t.same(uuidType.isBoolean(), false);
  t.same(uuidType.isBinary(), false);
  t.same(uuidType.isNumeric(), false);
  t.same(uuidType.isString(), true);
  t.same(uuidType.isMessage(), false);
  t.same(uuidType.allowedInSet(), true);

  try {
    uuidType.test = 1;
    t.fail('UuidType instance is mutable');
  } catch (e) {
    t.pass('UuidType instance is immutable');
  }

  t.end();
});


test('UuidType guard tests', (t) => {
  const field = new Field({ name: 'test', type: UuidType.create(), classProto: SampleUuidIdentifier });
  const valid = [
    SampleUuidIdentifier.generate(),
    SampleUuidIdentifier.fromString('4b268351-2445-4d98-a777-b461330d5c7f'),
    new SampleUuidIdentifier('4b268351-2445-4d98-a777-b461330d5c7a'),
  ];
  const invalid = [
    UuidIdentifier.generate(),
    '4b268351-2445-4d98-a777-b461330d5c7f',
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


test('UuidType encode tests', (t) => {
  const field = new Field({ name: 'test', type: UuidType.create(), classProto: SampleUuidIdentifier });
  const id = SampleUuidIdentifier.generate();
  const samples = [
    {
      input: SampleUuidIdentifier.fromString('4b268351-2445-4d98-a777-b461330d5c7f'),
      output: '4b268351-2445-4d98-a777-b461330d5c7f',
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


test('UuidType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: UuidType.create(), classProto: SampleUuidIdentifier });
  const id = SampleUuidIdentifier.generate();
  const samples = [
    {
      input: '4b268351-2445-4d98-a777-b461330d5c7f',
      output: SampleUuidIdentifier.fromString('4b268351-2445-4d98-a777-b461330d5c7f'),
    },
    { input: id.toString(), output: id },
    { input: id, output: id },
    { input: null, output: null },
  ];

  await helpers.decodeSamples(field, samples, t);
  t.end();
});


test('UuidType decode(invalid) tests', async (t) => {
  const field = new Field({ name: 'test', type: UuidType.create(), classProto: SampleUuidIdentifier });
  const samples = ['nope', '4b268351-2445-4d98-a777-b461330d5c7fX', false, [], {}, '', NaN, undefined];
  await helpers.decodeInvalidSamples(field, samples, t);
  t.end();
});
