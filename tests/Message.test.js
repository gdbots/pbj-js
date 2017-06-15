import test from 'tape';
import Message from '../src/Message';
import MessageRef from '../src/MessageRef';
import SchemaId from '../src/SchemaId';
import SampleMessageV1 from './Fixtures/SampleMessageV1';
import SampleMessageV2 from './Fixtures/SampleMessageV2';

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


test('Message string_single tests', (t) => {
  const msg = SampleMessageV1.create();

  t.false(msg.has('string_single'));
  t.false(msg.hasClearedField('string_single'));

  msg.set('string_single', 'test');
  t.true(msg.has('string_single'));
  t.same(msg.get('string_single'), 'test');
  t.same(msg.get('string_single', 'default'), 'test');

  msg.clear('string_single');
  t.true(msg.hasClearedField('string_single'));
  t.same(msg.getClearedFields(), ['string_single']);
  t.false(msg.has('string_single'));
  t.same(msg.get('string_single'), null);
  t.same(msg.get('string_single', 'default'), 'default');

  t.end();
});


test('Message string_set tests', (t) => {
  const msg = SampleMessageV1.create();

  t.false(msg.has('string_set'));
  t.false(msg.hasClearedField('string_set'));

  msg.addToSet('string_set', ['test1', 'test2']);
  t.true(msg.has('string_set'));
  t.same(msg.get('string_set'), ['test1', 'test2']);
  t.same(msg.get('string_set', ['default']), ['test1', 'test2']);

  msg.addToSet('string_set', ['test3']);
  t.same(msg.get('string_set'), ['test1', 'test2', 'test3']);

  msg.removeFromSet('string_set', ['test2']);
  t.same(msg.get('string_set'), ['test1', 'test3']);

  msg.addToSet('string_set', ['test1']);
  t.same(msg.get('string_set'), ['test1', 'test3']);

  msg.removeFromSet('string_set', ['test1', 'test2', 'test3']);
  t.true(msg.hasClearedField('string_set'));
  t.same(msg.getClearedFields(), ['string_set']);

  msg.addToSet('string_set', ['test1', 'test2']);
  t.false(msg.hasClearedField('string_set'));
  t.same(msg.getClearedFields(), []);

  msg.clear('string_set');
  t.true(msg.hasClearedField('string_set'));
  t.same(msg.getClearedFields(), ['string_set']);
  t.false(msg.has('string_set'));
  t.same(msg.get('string_set'), null);
  t.same(msg.get('string_set', ['default']), ['default']);

  // t.f();

  t.end();
});
