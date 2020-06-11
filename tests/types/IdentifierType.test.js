import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import IdentifierType from '../../src/types/IdentifierType';
import UuidIdentifier from '../../src/well-known/UuidIdentifier';
import SampleUuidIdentifier from '../fixtures/well-known/SampleUuidIdentifier';
import helpers from './helpers';

test('IdentifierType property tests', (t) => {
  const identifierType = IdentifierType.create();
  t.true(identifierType instanceof Type);
  t.true(identifierType instanceof IdentifierType);
  t.same(identifierType, IdentifierType.create());
  t.true(identifierType === IdentifierType.create());
  t.same(identifierType.getTypeName(), TypeName.IDENTIFIER);
  t.same(identifierType.getTypeValue(), TypeName.IDENTIFIER.valueOf());
  t.same(identifierType.isScalar(), false);
  t.same(identifierType.encodesToScalar(), true);
  t.same(identifierType.getDefault(), null);
  t.same(identifierType.isBoolean(), false);
  t.same(identifierType.isBinary(), false);
  t.same(identifierType.isNumeric(), false);
  t.same(identifierType.isString(), true);
  t.same(identifierType.isMessage(), false);
  t.same(identifierType.allowedInSet(), true);

  try {
    identifierType.test = 1;
    t.fail('IdentifierType instance is mutable');
  } catch (e) {
    t.pass('IdentifierType instance is immutable');
  }

  t.end();
});


test('IdentifierType guard tests', (t) => {
  const field = new Field({ name: 'test', type: IdentifierType.create(), classProto: SampleUuidIdentifier });
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


test('IdentifierType encode tests', (t) => {
  const field = new Field({ name: 'test', type: IdentifierType.create(), classProto: SampleUuidIdentifier });
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


test('IdentifierType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: IdentifierType.create(), classProto: SampleUuidIdentifier });
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


test('IdentifierType decode(invalid) tests', async (t) => {
  const field = new Field({ name: 'test', type: IdentifierType.create(), classProto: SampleUuidIdentifier });
  const samples = ['nope', '4b268351-2445-4d98-a777-b461330d5c7fX', false, [], {}, '', NaN, undefined];
  await helpers.decodeInvalidSamples(field, samples, t);
  t.end();
});
