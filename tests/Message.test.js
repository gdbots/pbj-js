import test from 'tape';
import FrozenMessageIsImmutable from '../src/exceptions/FrozenMessageIsImmutable';
import Message from '../src/Message';
import MessageRef from '../src/MessageRef';
import SchemaId from '../src/SchemaId';
import SampleMessageV1 from './fixtures/SampleMessageV1';
import SampleMessageV2 from './fixtures/SampleMessageV2';
import SampleOtherMessageV1 from './fixtures/SampleOtherMessageV1';

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
  t.same(msg.generateEtag(), '691d8ff26b59e53823ab9190624e34ed');
  t.same(msg.generateEtag(['string_single']), '573915f0765194ff95833311ca5c15c1');

  msg.set('string_single', ' ice 🍦 poop 💩 doh 😳 ');
  t.same(msg.generateEtag(), '2114f330e1ce728c47aad9013f84b07c');

  msg.set('string_single', '✓ à la mode');
  t.same(msg.generateEtag(), 'ee38a55ab894dbaa551f8870dd9cc4c4');

  msg.set('string_single', 'foo © bar 𝌆 baz');
  t.same(msg.generateEtag(), 'd6c22aca50a8c30f57e8e40e4d7c400d');

  msg.clear('string_single');
  t.same(msg.generateEtag(), '3362e2cd5e114f9c9bac62666fc05587');
  t.same(msg.generateEtag(['string_single']), '573915f0765194ff95833311ca5c15c1');
  t.same(msg.generateEtag(['string_single', 'message_map']), '796d3e61906902c815e1bf67685a45d8');

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


test('Message clone tests', (t) => {
  const msg = SampleMessageV1.create();
  msg.set('string_single', '123');
  msg.set('message_single', SampleOtherMessageV1.create().set('test', 'clone'));
  msg.freeze();

  t.true(msg.isFrozen());
  t.true(msg.get('message_single').isFrozen());

  const msgClone = msg.clone();
  t.false(msg === msgClone);
  t.false(msgClone.isFrozen());
  t.false(msgClone.get('message_single').isFrozen());
  t.true(msg.equals(msgClone));

  msgClone.set('string_single', '456');
  msgClone.get('message_single').set('test', 'clone2');
  t.false(msg.equals(msgClone));

  t.end();
});
