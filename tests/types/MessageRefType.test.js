import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import MessageRefType from '../../src/types/MessageRefType';
import MessageRef from '../../src/MessageRef';
import helpers from './helpers';

test('MessageRefType property tests', (t) => {
  const messageRefType = MessageRefType.create();
  t.true(messageRefType instanceof Type);
  t.true(messageRefType instanceof MessageRefType);
  t.same(messageRefType, MessageRefType.create());
  t.true(messageRefType === MessageRefType.create());
  t.same(messageRefType.getTypeName(), TypeName.MESSAGE_REF);
  t.same(messageRefType.getTypeValue(), TypeName.MESSAGE_REF.valueOf());
  t.same(messageRefType.isScalar(), false);
  t.same(messageRefType.encodesToScalar(), false);
  t.same(messageRefType.getDefault(), null);
  t.same(messageRefType.isBoolean(), false);
  t.same(messageRefType.isBinary(), false);
  t.same(messageRefType.isNumeric(), false);
  t.same(messageRefType.isString(), false);
  t.same(messageRefType.isMessage(), false);
  t.same(messageRefType.allowedInSet(), true);

  try {
    messageRefType.test = 1;
    t.fail('MessageRefType instance is mutable');
  } catch (e) {
    t.pass('MessageRefType instance is immutable');
  }

  t.end();
});


test('MessageRefType guard tests', (t) => {
  const field = new Field({ name: 'test', type: MessageRefType.create() });
  const valid = [
    MessageRef.fromString('acme:blog:node:article:123#tag'),
    MessageRef.fromString('acme:blog::article:2015/12/25/test:Still_The:id#2015.q4'),
  ];
  const invalid = [
    'acme:blog:node:article:123#tag',
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


test('MessageRefType encode tests', (t) => {
  const field = new Field({ name: 'test', type: MessageRefType.create() });
  const codec = { encodeMessageRef: value => value.toString() };
  const samples = [
    {
      input: MessageRef.fromString('acme:blog:node:article:123#tag'),
      output: 'acme:blog:node:article:123#tag',
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

  helpers.encodeSamples(field, samples, t, codec);
  t.end();
});


test('MessageRefType decode tests', (t) => {
  const field = new Field({ name: 'test', type: MessageRefType.create() });
  const codec = { decodeMessageRef: value => MessageRef.fromObject(value) };
  const ref = MessageRef.fromString('acme:blog::article:2015/12/25/test:Still_The:id#2015.Q4');
  const samples = [
    {
      input: ref.toObject(),
      output: ref,
    },
    { input: ref, output: ref },
    { input: null, output: null },
  ];

  helpers.decodeSamples(field, samples, t, codec);
  t.end();
});


test('MessageRefType decode(invalid) tests', (t) => {
  const field = new Field({ name: 'test', type: MessageRefType.create() });
  const codec = { decodeMessageRef: value => MessageRef.fromObject(value) };
  const samples = [
    'nope',
    { curie: 'invalid', id: 'what' },
    false,
    [],
    {},
    '',
    NaN,
    undefined,
  ];
  helpers.decodeInvalidSamples(field, samples, t, codec);
  t.end();
});
