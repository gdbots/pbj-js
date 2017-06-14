import test from 'tape';
import Message from '../src/Message';
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

  SampleMessageV1.create().schema();
  SampleMessageV2.create().schema();
  SampleMessageV1.create().schema();
  SampleMessageV2.create().schema();

  t.end();
});
