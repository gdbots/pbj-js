import test from 'tape';
import SampleMessageV1 from './Fixtures/SampleMessageV1';

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
