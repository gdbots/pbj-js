import test from 'tape';
import SampleMessageV1 from './Fixtures/SampleMessageV1';

test('Message string_set tests', (t) => {
  const msg = SampleMessageV1.create();

  t.false(msg.has('string_set'));
  t.false(msg.hasClearedField('string_set'));

  msg.addToSet('string_set', ['test1', 'test2']);
  t.true(msg.has('string_set'));
  t.same(msg.get('string_set'), ['test1', 'test2']);
  t.same(msg.get('string_set', ['default']), ['test1', 'test2']);
  t.true(msg.isInSet('string_set', 'test1'));
  t.true(msg.isInSet('string_set', 'test2'));
  t.false(msg.isInSet('string_set', 'test3'));

  msg.addToSet('string_set', ['test3']);
  t.same(msg.get('string_set'), ['test1', 'test2', 'test3']);
  t.true(msg.isInSet('string_set', 'test1'));
  t.true(msg.isInSet('string_set', 'test2'));
  t.true(msg.isInSet('string_set', 'test3'));

  msg.removeFromSet('string_set', ['test2']);
  t.same(msg.get('string_set'), ['test1', 'test3']);
  t.true(msg.isInSet('string_set', 'test1'));
  t.false(msg.isInSet('string_set', 'test2'));
  t.true(msg.isInSet('string_set', 'test3'));

  msg.addToSet('string_set', ['test1']);
  t.same(msg.get('string_set'), ['test1', 'test3']);
  t.true(msg.isInSet('string_set', 'test1'));
  t.false(msg.isInSet('string_set', 'test2'));
  t.true(msg.isInSet('string_set', 'test3'));

  msg.removeFromSet('string_set', ['test1', 'test2', 'test3']);
  t.true(msg.hasClearedField('string_set'));
  t.same(msg.getClearedFields(), ['string_set']);
  t.false(msg.isInSet('string_set', 'test1'));
  t.false(msg.isInSet('string_set', 'test2'));
  t.false(msg.isInSet('string_set', 'test3'));

  msg.addToSet('string_set', ['test1', 'test2']);
  t.false(msg.hasClearedField('string_set'));
  t.same(msg.getClearedFields(), []);
  t.true(msg.isInSet('string_set', 'test1'));
  t.true(msg.isInSet('string_set', 'test2'));
  t.false(msg.isInSet('string_set', 'test3'));

  msg.clear('string_set');
  t.true(msg.hasClearedField('string_set'));
  t.same(msg.getClearedFields(), ['string_set']);
  t.false(msg.has('string_set'));
  t.same(msg.get('string_set'), null);
  t.same(msg.get('string_set', ['default']), ['default']);
  t.false(msg.isInSet('string_set', 'test1'));
  t.false(msg.isInSet('string_set', 'test2'));
  t.false(msg.isInSet('string_set', 'test3'));

  t.end();
});
