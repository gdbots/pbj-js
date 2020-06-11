import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import MessageType from '../../src/types/MessageType';
import Message from '../../src/Message';
import helpers from './helpers';
import SampleMessageV1 from '../fixtures/SampleMessageV1';
import SampleOtherMessageV1 from '../fixtures/SampleOtherMessageV1';

test('MessageType property tests', (t) => {
  const messageType = MessageType.create();
  t.true(messageType instanceof Type);
  t.true(messageType instanceof MessageType);
  t.same(messageType, MessageType.create());
  t.true(messageType === MessageType.create());
  t.same(messageType.getTypeName(), TypeName.MESSAGE);
  t.same(messageType.getTypeValue(), TypeName.MESSAGE.valueOf());
  t.same(messageType.isScalar(), false);
  t.same(messageType.encodesToScalar(), false);
  t.same(messageType.getDefault(), null);
  t.same(messageType.isBoolean(), false);
  t.same(messageType.isBinary(), false);
  t.same(messageType.isNumeric(), false);
  t.same(messageType.isString(), false);
  t.same(messageType.isMessage(), true);
  t.same(messageType.allowedInSet(), false);

  try {
    messageType.test = 1;
    t.fail('MessageType instance is mutable');
  } catch (e) {
    t.pass('MessageType instance is immutable');
  }

  t.end();
});


test('MessageType guard tests', (t) => {
  const field = new Field({ name: 'test', type: MessageType.create(), classProto: SampleMessageV1 });
  const valid = [
    SampleMessageV1.create().set('string_single', 'test'),
    SampleMessageV1.create().set('mixin_int', 5),
    SampleOtherMessageV1.create(),
  ];
  const invalid = [
    'test',
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


test('MessageType guard (anyOfCuries) tests', (t) => {
  const field = new Field({
    name: 'test',
    type: MessageType.create(),
    classProto: SampleMessageV1,
    anyOfCuries: ['gdbots:pbj.tests::sample-message'],
  });
  const valid = [SampleMessageV1.create()];
  const invalid = [SampleOtherMessageV1.create()];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('MessageType encode tests', (t) => {
  const field = new Field({ name: 'test', type: MessageType.create(), classProto: SampleMessageV1 });
  const codec = { encodeMessage: value => value.toJSON() };
  const samples = [
    {
      input: SampleMessageV1.create().set('string_single', 'test'),
      output: {
        _schema: 'pbj:gdbots:pbj.tests::sample-message:1-0-0',
        mixin_int: 0,
        string_single: 'test',
      },
    },
    {
      input: SampleMessageV1.create().set('mixin_int', 5),
      output: {
        _schema: 'pbj:gdbots:pbj.tests::sample-message:1-0-0',
        mixin_int: 5,
      },
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


test('MessageType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: MessageType.create(), classProto: SampleMessageV1 });
  const codec = { decodeMessage: async (value) => Message.fromObject(value) };
  const message = SampleMessageV1.create().set('string_single', 'test');
  const samples = [
    {
      input: {
        _schema: 'pbj:gdbots:pbj.tests::sample-message:1-0-0',
        mixin_int: 0,
        string_single: 'test',
      },
      output: SampleMessageV1.create().set('string_single', 'test'),
    },
    {
      input: {
        _schema: 'pbj:gdbots:pbj.tests::sample-message:1-0-0',
        mixin_int: 5,
      },
      output: SampleMessageV1.create().set('mixin_int', 5),
    },
    { input: message, output: message },
    { input: null, output: null },
  ];

  await helpers.decodeSamples(field, samples, t, codec);
  t.end();
});


test('MessageType decode(invalid) tests', async (t) => {
  const field = new Field({
    name: 'test',
    type: MessageType.create(),
    classProto: SampleMessageV1,
    anyOfCuries: ['gdbots:pbj.tests::sample-message'],
  });
  const codec = { decodeMessage: async (value) => Message.fromObject(value) };
  const samples = [
    SampleMessageV1,
    'nope',
    { name: 'test', nothing: true },
    { name: 'test' },
    false,
    [],
    {},
    '',
    NaN,
    undefined,
  ];
  await helpers.decodeInvalidSamples(field, samples, t, codec);
  t.end();
});
