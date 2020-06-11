import test from 'tape';
import MoreThanOneMessageForMixin from '../src/exceptions/MoreThanOneMessageForMixin';
import NoMessageForCurie from '../src/exceptions/NoMessageForCurie';
import NoMessageForMixin from '../src/exceptions/NoMessageForMixin';
import NoMessageForQName from '../src/exceptions/NoMessageForQName';
import NoMessageForSchemaId from '../src/exceptions/NoMessageForSchemaId';
import MessageResolver from '../src/MessageResolver';
import SchemaCurie from '../src/SchemaCurie';
import SchemaId from '../src/SchemaId';
import SampleMessageV1 from './fixtures/SampleMessageV1';
import SampleMessageV2 from './fixtures/SampleMessageV2';
import SampleOtherMessageV1 from './fixtures/SampleOtherMessageV1';


test('MessageResolver all tests', async (t) => {
  const all = (await Promise.all(Object.entries(MessageResolver.all()).map(async ([curie, promise]) => {
    return [curie, (await promise).default];
  }))).map(item => item[1]);

  t.same(all.length, 3);

  t.true(all.includes(SampleMessageV1));
  t.true(all.includes(SampleMessageV2));
  t.true(all.includes(SampleOtherMessageV1));
  t.same(MessageResolver.getDefaultVendor(), '');
  MessageResolver.setDefaultVendor('acme');
  t.same(MessageResolver.getDefaultVendor(), 'acme');

  t.end();
});


test('MessageResolver resolveId tests', async (t) => {
  const message = await MessageResolver.resolveId(SchemaId.fromString('pbj:gdbots:pbj.tests::sample-message:1-0-0'));
  t.true(message === SampleMessageV1);

  try {
    await MessageResolver.resolveId(SchemaId.fromString('pbj:gdbots:pbj.tests::invalid-message:1-0-0'));
    t.fail('resolved invalid SchemaId');
  } catch (e) {
    t.true(e instanceof NoMessageForSchemaId, 'Exception MUST be an instanceOf NoMessageForSchemaId');
    t.pass(e.message);
  }

  t.end();
});


test('MessageResolver resolveCurie tests', async (t) => {
  let message = await MessageResolver.resolveCurie('gdbots:pbj.tests::sample-message');
  console.log(message);
  t.true(message === SampleMessageV2);
  t.true(MessageResolver.hasCurie('gdbots:pbj.tests::sample-other-message'));

  message = await MessageResolver.resolveCurie('gdbots:pbj.tests::sample-other-message');
  t.true(message === SampleOtherMessageV1);
  t.true(MessageResolver.hasCurie('gdbots:pbj.tests::sample-other-message'));

  try {
    await MessageResolver.resolveCurie('gdbots:pbj.tests::invalid-message');
    t.fail('resolved invalid SchemaCurie');
  } catch (e) {
    t.true(e instanceof NoMessageForCurie, 'Exception MUST be an instanceOf NoMessageForCurie');
    t.pass(e.message);
  }

  t.end();
});


test('MessageResolver resolveQName tests', async (t) => {
  let message = await MessageResolver.resolveQName('gdbots:sample-message');
  t.true(message === SampleMessageV2);
  t.true(MessageResolver.hasQName('gdbots:sample-message'));

  message = await MessageResolver.resolveQName('gdbots:sample-other-message');
  t.true(message === SampleOtherMessageV1);
  t.true(MessageResolver.hasQName('gdbots:sample-other-message'));

  t.false(MessageResolver.hasQName('gdbots:invalid-message'));

  try {
    await MessageResolver.resolveQName('gdbots:invalid-message');
    t.fail('resolved invalid SchemaQName');
  } catch (e) {
    t.true(e instanceof NoMessageForQName, 'Exception MUST be an instanceOf NoMessageForQName');
    t.pass(e.message);
  }

  t.end();
});


test('MessageResolver findOneUsingMixin tests', async (t) => {
  const mixin = 'gdbots:pbj.tests:mixin:one:v1';
  let curie = await MessageResolver.findOneUsingMixin(mixin);
  t.same(curie, 'gdbots:pbj.tests::sample-message:v2');

  const message = await MessageResolver.resolveCurie(curie);
  t.same(message, SampleMessageV2);

  curie = await MessageResolver.findOneUsingMixin(mixin, false);
  t.same(curie, 'gdbots:pbj.tests::sample-message');

  try {
    await MessageResolver.findOneUsingMixin('gdbots:pbj.tests:mixin:none:v1');
    t.fail('findOneUsingMixin found message for invalid mixin');
  } catch (e) {
    t.true(e instanceof NoMessageForMixin, 'Exception MUST be an instanceOf NoMessageForMixin');
    t.pass(e.message);
  }

  try {
    await MessageResolver.findOneUsingMixin('gdbots:pbj.tests:mixin:many:v1');
    t.fail('findOneUsingMixin found one schema for mixin used more than once');
  } catch (e) {
    t.true(e instanceof MoreThanOneMessageForMixin, 'Exception MUST be an instanceOf MoreThanOneMessageForMixin');
    t.pass(e.message);
  }

  t.end();
});


test('MessageResolver findAllUsingMixin tests', async (t) => {
  let mixin = 'gdbots:pbj.tests:mixin:many:v1';
  let curies = await MessageResolver.findAllUsingMixin(mixin);
  t.true(await MessageResolver.hasAnyUsingMixin(mixin));
  t.same(2, curies.length);
  t.same(curies[0], 'gdbots:pbj.tests::sample-message:v1');
  t.same(curies[1], 'gdbots:pbj.tests::sample-other-message:v1');

  curies = await MessageResolver.findAllUsingMixin(mixin, false);
  t.true(await MessageResolver.hasAnyUsingMixin(mixin));
  t.same(2, curies.length);
  t.same(curies[0], 'gdbots:pbj.tests::sample-message');
  t.same(curies[1], 'gdbots:pbj.tests::sample-other-message');

  mixin = 'gdbots:pbj.tests:mixin:one:v1';
  curies = await MessageResolver.findAllUsingMixin(mixin);
  t.true(await MessageResolver.hasAnyUsingMixin(mixin));
  t.same(1, curies.length);
  t.same(curies[0], 'gdbots:pbj.tests::sample-message:v2');

  mixin = 'gdbots:pbj.tests:mixin:none:v1';
  curies = await MessageResolver.findAllUsingMixin(mixin);
  t.false(await MessageResolver.hasAnyUsingMixin(mixin));
  t.same(0, curies.length);

  t.end();
});
