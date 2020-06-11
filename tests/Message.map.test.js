import test from 'tape';
import SampleMessageV1 from './fixtures/SampleMessageV1';
import SampleOtherMessageV1 from './fixtures/SampleOtherMessageV1';

test('Message string_map tests', (t) => {
  const msg = SampleMessageV1.create();

  t.false(msg.has('string_map'));
  msg.addToMap('string_map', 'test1', 'val1');
  msg.addToMap('string_map', 'test2', 'val2');
  t.true(msg.has('string_map'));
  t.same(msg.get('string_map'), { test1: 'val1', test2: 'val2' });
  t.same(msg.get('string_map', { test1: 'default' }), { test1: 'val1', test2: 'val2' });
  t.same(msg.getFromMap('string_map', 'test1'), 'val1');
  t.same(msg.getFromMap('string_map', 'test2'), 'val2');
  t.true(msg.isInMap('string_map', 'test1'));
  t.true(msg.isInMap('string_map', 'test2'));
  t.false(msg.isInMap('string_map', 'test3'));

  msg.addToMap('string_map', 'test3', 'val3');
  t.same(msg.get('string_map'), { test1: 'val1', test2: 'val2', test3: 'val3' });
  t.same(msg.getFromMap('string_map', 'test1'), 'val1');
  t.same(msg.getFromMap('string_map', 'test2'), 'val2');
  t.same(msg.getFromMap('string_map', 'test3'), 'val3');
  t.true(msg.isInMap('string_map', 'test1'));
  t.true(msg.isInMap('string_map', 'test2'));
  t.true(msg.isInMap('string_map', 'test3'));

  msg.removeFromMap('string_map', 'test2');
  t.same(msg.get('string_map'), { test1: 'val1', test3: 'val3' });
  t.true(msg.isInMap('string_map', 'test1'));
  t.false(msg.isInMap('string_map', 'test2'));
  t.true(msg.isInMap('string_map', 'test3'));

  msg.addToMap('string_map', 'test1', 'newval1');
  t.same(msg.getFromMap('string_map', 'test1'), 'newval1');
  t.same(msg.get('string_map'), { test1: 'newval1', test3: 'val3' });
  t.true(msg.isInMap('string_map', 'test1'));
  t.false(msg.isInMap('string_map', 'test2'));
  t.true(msg.isInMap('string_map', 'test3'));

  msg.addToMap('string_map', 'test2', 'newval2');
  t.same(msg.getFromMap('string_map', 'test2'), 'newval2');
  t.same(msg.getFromMap('string_map', 'invalid', 'default'), 'default');
  t.same(msg.get('string_map'), { test1: 'newval1', test3: 'val3', test2: 'newval2' });
  t.true(msg.isInMap('string_map', 'test1'));
  t.true(msg.isInMap('string_map', 'test2'));
  t.true(msg.isInMap('string_map', 'test3'));

  msg.removeFromMap('string_map', 'test1');
  msg.removeFromMap('string_map', 'test2');
  msg.removeFromMap('string_map', 'test3');
  t.false(msg.isInMap('string_map', 'test1'));
  t.false(msg.isInMap('string_map', 'test2'));
  t.false(msg.isInMap('string_map', 'test3'));

  msg.addToMap('string_map', 'test1', 'val1');
  t.true(msg.isInMap('string_map', 'test1'));
  t.false(msg.isInMap('string_map', 'test2'));
  t.false(msg.isInMap('string_map', 'test3'));

  msg.clear('string_map');
  t.false(msg.has('string_map'));
  t.same(msg.get('string_map'), null);
  t.same(msg.get('string_map', { test: 'what' }), { test: 'what' });
  t.false(msg.isInMap('string_map', 'test1'));
  t.false(msg.isInMap('string_map', 'test2'));
  t.false(msg.isInMap('string_map', 'test3'));

  t.end();
});


test('Message message_map tests', (t) => {
  const msg = SampleMessageV1.create();
  const otherMsg1 = SampleOtherMessageV1.create().set('test', 'test1');
  const otherMsg2 = SampleOtherMessageV1.create().set('test', 'test2');
  const otherMsg3 = SampleOtherMessageV1.create().set('test', 'test3');
  const otherMsg4 = SampleOtherMessageV1.create().set('test', 'test4');

  t.false(msg.has('message_map'));
  msg.addToMap('message_map', 'test1', otherMsg1);
  msg.addToMap('message_map', 'test2', otherMsg2);
  t.true(msg.has('message_map'));
  t.same(msg.get('message_map'), { test1: otherMsg1, test2: otherMsg2 });
  t.same(msg.get('message_map', { test1: 'default' }), { test1: otherMsg1, test2: otherMsg2 });
  t.same(msg.getFromMap('message_map', 'test1'), otherMsg1);
  t.same(msg.getFromMap('message_map', 'test2'), otherMsg2);
  t.true(msg.isInMap('message_map', 'test1'));
  t.true(msg.isInMap('message_map', 'test2'));
  t.false(msg.isInMap('message_map', 'test3'));

  msg.addToMap('message_map', 'test3', otherMsg3);
  t.same(msg.get('message_map'), { test1: otherMsg1, test2: otherMsg2, test3: otherMsg3 });
  t.same(msg.getFromMap('message_map', 'test1'), otherMsg1);
  t.same(msg.getFromMap('message_map', 'test2'), otherMsg2);
  t.same(msg.getFromMap('message_map', 'test3'), otherMsg3);
  t.true(msg.isInMap('message_map', 'test1'));
  t.true(msg.isInMap('message_map', 'test2'));
  t.true(msg.isInMap('message_map', 'test3'));

  msg.removeFromMap('message_map', 'test2');
  t.same(msg.get('message_map'), { test1: otherMsg1, test3: otherMsg3 });
  t.true(msg.isInMap('message_map', 'test1'));
  t.false(msg.isInMap('message_map', 'test2'));
  t.true(msg.isInMap('message_map', 'test3'));

  msg.addToMap('message_map', 'test1', otherMsg4);
  t.same(msg.getFromMap('message_map', 'test1'), otherMsg4);
  t.same(msg.get('message_map'), { test1: otherMsg4, test3: otherMsg3 });
  t.true(msg.isInMap('message_map', 'test1'));
  t.false(msg.isInMap('message_map', 'test2'));
  t.true(msg.isInMap('message_map', 'test3'));

  msg.addToMap('message_map', 'test2', otherMsg4);
  t.same(msg.getFromMap('message_map', 'test2'), otherMsg2);
  t.same(msg.getFromMap('message_map', 'invalid', 'default'), 'default');
  t.same(msg.get('message_map'), { test1: otherMsg4, test3: otherMsg3, test2: otherMsg4 });
  t.true(msg.isInMap('message_map', 'test1'));
  t.true(msg.isInMap('message_map', 'test2'));
  t.true(msg.isInMap('message_map', 'test3'));

  msg.removeFromMap('message_map', 'test1');
  msg.removeFromMap('message_map', 'test2');
  msg.removeFromMap('message_map', 'test3');
  t.false(msg.isInMap('message_map', 'test1'));
  t.false(msg.isInMap('message_map', 'test2'));
  t.false(msg.isInMap('message_map', 'test3'));

  msg.addToMap('message_map', 'test1', otherMsg1);
  t.true(msg.isInMap('message_map', 'test1'));
  t.false(msg.isInMap('message_map', 'test2'));
  t.false(msg.isInMap('message_map', 'test3'));

  msg.clear('message_map');
  t.false(msg.has('message_map'));
  t.same(msg.get('message_map'), null);
  t.same(msg.get('message_map', { test: 'what' }), { test: 'what' });
  t.false(msg.isInMap('message_map', 'test1'));
  t.false(msg.isInMap('message_map', 'test2'));
  t.false(msg.isInMap('message_map', 'test3'));

  t.end();
});
