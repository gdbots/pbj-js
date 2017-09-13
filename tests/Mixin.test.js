import test from 'tape';
import Mixin from '../src/Mixin';
import SchemaId from '../src/SchemaId';
import SampleMixinV1 from './fixtures/SampleMixinV1';
import SampleMixinV2 from './fixtures/SampleMixinV2';
import SampleUnusedMixinV1 from './fixtures/SampleUnusedMixinV1';

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


test('Mixin findOne/findAll tests', (t) => {
  const mixin1 = SampleMixinV1.create();
  const mixin2 = SampleMixinV2.create();
  const unusedMixin = SampleUnusedMixinV1.create();

  t.same(SampleMixinV1.findAll().length, 2);
  t.same(mixin1.findAll().length, 2);

  t.same(SampleMixinV2.findOne().getCurie().toString(), 'gdbots:pbj.tests::sample-message');
  t.same(mixin2.findOne().getCurie().toString(), 'gdbots:pbj.tests::sample-message');

  try {
    mixin1.findOne();
    t.fail('mixin findOne should not pass when has multiple consumers');
  } catch (e) {
    t.pass('mixin findOne failed since it has multiple consumers');
  }

  try {
    SampleUnusedMixinV1.findAll();
    unusedMixin.findAll();
    SampleUnusedMixinV1.findOne();
    unusedMixin.findOne();
    t.fail('unusedMixin findOne/findAll should not pass when has no consumers');
  } catch (e) {
    t.pass('mixin findOne/findAll failed since it has no consumers');
  }

  t.end();
});
