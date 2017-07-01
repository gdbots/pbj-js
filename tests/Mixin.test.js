import test from 'tape';
import Mixin from '../src/Mixin';
import SchemaId from '../src/SchemaId';
import SampleMixinV1 from './fixtures/SampleMixinV1';

test('Mixin tests', (t) => {
  const mixin = SampleMixinV1.create();

  t.true(mixin instanceof Mixin, 'mixin MUST be an instanceOf Mixin');
  t.true(mixin instanceof SampleMixinV1, 'mixin MUST be an instanceOf SampleMixinV1');
  t.true(mixin === SampleMixinV1.create(), 'SampleMixinV1.create() must return the same instance');
  t.true(mixin.getId() === SchemaId.fromString('pbj:gdbots:pbj.tests::sample-mixin:1-0-0'));
  t.same(2, mixin.getFields().length);

  try {
    mixin.test = 1;
    t.fail('mixin instance is mutable');
  } catch (e) {
    t.pass('mixin instance is immutable');
  }

  t.end();
});
