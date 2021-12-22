import test from 'tape';
import FrozenMessageIsImmutable from '../src/exceptions/FrozenMessageIsImmutable.js';
import Message from '../src/Message.js';
import MessageRef from '../src/well-known/MessageRef.js';
import SchemaId from '../src/SchemaId.js';
import SampleMessageV1 from './fixtures/SampleMessageV1.js';
import SampleMessageV2 from './fixtures/SampleMessageV2.js';
import SampleOtherMessageV1 from './fixtures/SampleOtherMessageV1.js';


test('Message tests', (t) => {
  const msg1 = SampleMessageV1.create();
  const msg2 = SampleMessageV2.create();

  t.true(msg1 instanceof Message, 'msg1 MUST be an instanceOf Message');
  t.true(msg2 instanceof Message, 'msg2 MUST be an instanceOf Message');
  t.true(msg1 instanceof SampleMessageV1, 'msg1 MUST be an instanceOf SampleMessageV1');
  t.true(msg2 instanceof SampleMessageV2, 'msg2 MUST be an instanceOf SampleMessageV2');

  t.true(SampleMessageV1.schema() === msg1.schema());
  t.true(SampleMessageV2.schema() === msg2.schema());
  t.true(SampleMessageV1.schema().getId() === SchemaId.fromString('pbj:gdbots:pbj.tests::sample-message:1-0-0'));
  t.true(SampleMessageV2.schema().getId() === SchemaId.fromString('pbj:gdbots:pbj.tests::sample-message:2-0-0'));
  t.true(msg1.schema().getId() === SchemaId.fromString('pbj:gdbots:pbj.tests::sample-message:1-0-0'));
  t.true(msg2.schema().getId() === SchemaId.fromString('pbj:gdbots:pbj.tests::sample-message:2-0-0'));

  msg1.set('string_single', '123');
  t.true(msg1.generateMessageRef().equals(MessageRef.fromString('gdbots:pbj.tests::sample-message:123')));
  t.true(msg1.generateMessageRef('tag').equals(MessageRef.fromString('gdbots:pbj.tests::sample-message:123#tag')));
  t.same(msg1.getUriTemplateVars(), { string_single: '123' });

  t.end();
});


test('Message generateEtag tests', (t) => {
  const msg = SampleMessageV1.create();

  msg.set('string_single', '123');
  t.same(msg.generateEtag(), '66b1c306cef44f5f1160d5f676b26bf7');
  t.same(msg.generateEtag(['string_single']), '70fc98834fc95677666e5af2caf26dcf');

  msg.set('string_single', ' ice 🍦 poop 💩 doh 😳 ');
  t.same(msg.generateEtag(), '2028ec90f537badedbc19b77b091511c');

  msg.set('string_single', '✓ à la mode');
  t.same(msg.generateEtag(), '8b1ad0f532c594ee05142fa0517f9eab');

  msg.set('string_single', 'foo © bar 𝌆 baz');
  t.same(msg.generateEtag(), 'd07baf4c9f17307d66b599d8c6059b9b');

  msg.clear('string_single');
  t.same(msg.generateEtag(), '70fc98834fc95677666e5af2caf26dcf');
  t.same(msg.generateEtag(['string_single']), '70fc98834fc95677666e5af2caf26dcf');
  t.same(msg.generateEtag(['string_single', 'message_map']), '70fc98834fc95677666e5af2caf26dcf');

  t.end();
});


test('Message freeze tests', (t) => {
  let msg = SampleMessageV1.create();
  msg.set('string_single', '123');
  msg.freeze();

  t.true(msg.isFrozen());

  try {
    msg.set('string_single', 'test');
    t.fail('frozen message is mutable');
  } catch (e) {
    t.true(e instanceof FrozenMessageIsImmutable, 'Exception MUST be an instanceOf FrozenMessageIsImmutable');
    t.pass(e.message);
  }

  msg = SampleMessageV1.create();
  msg.set('message_single', SampleOtherMessageV1.create().set('test', 'freeze'));
  msg.freeze();

  t.true(msg.isFrozen());
  t.true(msg.get('message_single').isFrozen());

  try {
    msg.get('message_single').set('test', 'test');
    t.fail('nested frozen message is mutable');
  } catch (e) {
    t.true(e instanceof FrozenMessageIsImmutable, 'Exception MUST be an instanceOf FrozenMessageIsImmutable');
    t.pass(e.message);
  }

  t.end();
});


test('Message isReplay tests', (t) => {
  let msg = SampleMessageV1.create();
  msg.isReplay(true);
  t.true(msg.isReplay());
  t.true(msg.isReplay());

  try {
    msg.isReplay(true);
    t.fail('isReplay(true) was allowed to be set more than once.');
  } catch (e) {
    t.pass(e.message);
  }

  msg = SampleMessageV1.create();
  msg.isReplay(false);
  t.false(msg.isReplay());
  t.false(msg.isReplay());

  try {
    msg.isReplay(false);
    t.fail('isReplay(false) was allowed to be set more than once.');
  } catch (e) {
    t.pass(e.message);
  }

  msg = SampleMessageV1.create();
  t.false(msg.isReplay());
  t.false(msg.isReplay());

  try {
    msg.isReplay(true);
    t.fail('isReplay was allowed to be reset.');
  } catch (e) {
    t.pass(e.message);
  }

  t.end();
});


test('Message clone tests', async (t) => {
  const msg = SampleMessageV1.create();
  msg.set('string_single', '123');
  msg.set('message_single', SampleOtherMessageV1.create().set('test', 'clone'));
  msg.freeze();

  t.true(msg.isFrozen());
  t.true(msg.get('message_single').isFrozen());

  const msgClone = await msg.clone();
  t.false(msg === msgClone);
  t.false(msgClone.isFrozen());
  t.false(msgClone.get('message_single').isFrozen());
  t.true(msg.equals(msgClone));

  msgClone.set('string_single', '456');
  msgClone.get('message_single').set('test', 'clone2');
  t.false(msg.equals(msgClone));

  t.end();
});
