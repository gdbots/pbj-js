import test from 'tape';
import MoreThanOneMessageForMixin from '../src/exceptions/MoreThanOneMessageForMixin';
import NoMessageForCurie from '../src/exceptions/NoMessageForCurie';
import NoMessageForMixin from '../src/exceptions/NoMessageForMixin';
import NoMessageForQName from '../src/exceptions/NoMessageForQName';
import NoMessageForSchemaId from '../src/exceptions/NoMessageForSchemaId';
import MessageResolver from '../src/MessageResolver';
import SchemaCurie from '../src/SchemaCurie';
import SchemaId from '../src/SchemaId';
import SchemaQName from '../src/SchemaQName';
import SampleMessageV1 from './fixtures/SampleMessageV1';
import SampleMessageV2 from './fixtures/SampleMessageV2';
import SampleOtherMessageV1 from './fixtures/SampleOtherMessageV1';
import SampleMixinV1 from './fixtures/SampleMixinV1';
import SampleMixinV2 from './fixtures/SampleMixinV2';
import SampleUnusedMixinV1 from './fixtures/SampleUnusedMixinV1';

test('MessageResolver all tests', (t) => {
  const all = MessageResolver.all();

  t.same(all.length, 3);
  t.true(all.includes(SampleMessageV1));
  t.true(all.includes(SampleMessageV2));
  t.true(all.includes(SampleOtherMessageV1));

  t.end();
});


test('MessageResolver resolveId tests', (t) => {
  const message = MessageResolver.resolveId(SchemaId.fromString('pbj:gdbots:pbj.tests::sample-message:1-0-0'));
  t.true(message === SampleMessageV1);

  try {
    MessageResolver.resolveId(SchemaId.fromString('pbj:gdbots:pbj.tests::invalid-message:1-0-0'));
    t.fail('resolved invalid SchemaId');
  } catch (e) {
    t.true(e instanceof NoMessageForSchemaId, 'Exception MUST be an instanceOf NoMessageForSchemaId');
    t.pass(e.message);
  }

  t.end();
});


test('MessageResolver resolveCurie tests', (t) => {
  let message = MessageResolver.resolveCurie(SchemaCurie.fromString('gdbots:pbj.tests::sample-message'));
  t.true(message === SampleMessageV2);

  message = MessageResolver.resolveCurie(SchemaCurie.fromString('gdbots:pbj.tests::sample-other-message'));
  t.true(message === SampleOtherMessageV1);

  try {
    MessageResolver.resolveCurie(SchemaCurie.fromString('gdbots:pbj.tests::invalid-message'));
    t.fail('resolved invalid SchemaCurie');
  } catch (e) {
    t.true(e instanceof NoMessageForCurie, 'Exception MUST be an instanceOf NoMessageForCurie');
    t.pass(e.message);
  }

  t.end();
});


test('MessageResolver resolveQName tests', (t) => {
  let curie = MessageResolver.resolveQName(SchemaQName.fromString('gdbots:sample-message'));
  t.true(curie === SchemaCurie.fromString('gdbots:pbj.tests::sample-message'));

  curie = MessageResolver.resolveQName(SchemaQName.fromString('gdbots:sample-other-message'));
  t.true(curie === SchemaCurie.fromString('gdbots:pbj.tests::sample-other-message'));

  try {
    MessageResolver.resolveQName(SchemaQName.fromString('gdbots:invalid-message'));
    t.fail('resolved invalid SchemaQName');
  } catch (e) {
    t.true(e instanceof NoMessageForQName, 'Exception MUST be an instanceOf NoMessageForQName');
    t.pass(e.message);
  }

  t.end();
});


test('MessageResolver findOneUsingMixin tests', (t) => {
  const mixin = SampleMixinV2.create();
  const schema = MessageResolver.findOneUsingMixin(mixin);

  t.same(schema.getId(), SchemaId.fromString('pbj:gdbots:pbj.tests::sample-message:2-0-0'));
  t.true(schema.createMessage() instanceof SampleMessageV2);

  try {
    MessageResolver.findOneUsingMixin(SampleUnusedMixinV1.create());
    t.fail('findOneUsingMixin found schema for invalid mixin');
  } catch (e) {
    t.true(e instanceof NoMessageForMixin, 'Exception MUST be an instanceOf NoMessageForMixin');
    t.pass(e.message);
  }

  try {
    MessageResolver.findOneUsingMixin(SampleMixinV1.create());
    t.fail('findOneUsingMixin found one schema for mixin used more than once');
  } catch (e) {
    t.true(e instanceof MoreThanOneMessageForMixin, 'Exception MUST be an instanceOf MoreThanOneMessageForMixin');
    t.pass(e.message);
  }

  t.end();
});


test('MessageResolver findAllUsingMixin tests', (t) => {
  let mixin = SampleMixinV1.create();
  let schemas = MessageResolver.findAllUsingMixin(mixin);

  t.same(2, schemas.length);
  t.same(schemas[0].getId(), SchemaId.fromString('pbj:gdbots:pbj.tests::sample-message:1-0-0'));
  t.same(schemas[1].getId(), SchemaId.fromString('pbj:gdbots:pbj.tests::sample-other-message:1-0-0'));
  t.true(schemas[0].createMessage() instanceof SampleMessageV1);
  t.true(schemas[1].createMessage() instanceof SampleOtherMessageV1);

  mixin = SampleMixinV2.create();
  schemas = MessageResolver.findAllUsingMixin(mixin);

  t.same(1, schemas.length);
  t.same(schemas[0].getId(), SchemaId.fromString('pbj:gdbots:pbj.tests::sample-message:2-0-0'));
  t.true(schemas[0].createMessage() instanceof SampleMessageV2);

  try {
    MessageResolver.findAllUsingMixin(SampleUnusedMixinV1.create());
    t.fail('findOneUsingMixin found schema for invalid mixin');
  } catch (e) {
    t.true(e instanceof NoMessageForMixin, 'Exception MUST be an instanceOf NoMessageForMixin');
    t.pass(e.message);
  }

  t.end();
});
