import test from 'tape';
import SampleMessageV1 from './fixtures/SampleMessageV1';
import SampleOtherMessageV1 from './fixtures/SampleOtherMessageV1';

test('Message string_list tests', (t) => {
  const msg = SampleMessageV1.create();

  t.false(msg.has('string_list'));
  t.false(msg.hasClearedField('string_list'));

  msg.addToList('string_list', ['test1', 'test2']);
  t.true(msg.has('string_list'));
  t.same(msg.get('string_list'), ['test1', 'test2']);
  t.same(msg.get('string_list', ['default']), ['test1', 'test2']);
  t.same(msg.getFromListAt('string_list', 0), 'test1');
  t.same(msg.getFromListAt('string_list', 1), 'test2');
  t.same(msg.getFromListAt('string_list', 0, 'default'), 'test1');
  t.same(msg.getFromListAt('string_list', 1, 'default'), 'test2');
  t.same(msg.getFromListAt('string_list', 2, 'default'), 'default');
  t.true(msg.isInList('string_list', 'test1'));
  t.true(msg.isInList('string_list', 'test2'));
  t.false(msg.isInList('string_list', 'test3'));

  msg.addToList('string_list', ['test3']);
  t.same(msg.get('string_list'), ['test1', 'test2', 'test3']);
  t.same(msg.getFromListAt('string_list', 2, 'default'), 'test3');
  t.true(msg.isInList('string_list', 'test1'));
  t.true(msg.isInList('string_list', 'test2'));
  t.true(msg.isInList('string_list', 'test3'));

  msg.removeFromListAt('string_list', 0);
  t.same(msg.get('string_list'), ['test2', 'test3']);
  t.same(msg.getFromListAt('string_list', 0), 'test2');
  t.same(msg.getFromListAt('string_list', 1), 'test3');
  t.false(msg.isInList('string_list', 'test1'));
  t.true(msg.isInList('string_list', 'test2'));
  t.true(msg.isInList('string_list', 'test3'));

  msg.addToList('string_list', ['test1']);
  t.same(msg.get('string_list'), ['test2', 'test3', 'test1']);
  t.same(msg.getFromListAt('string_list', 0), 'test2');
  t.same(msg.getFromListAt('string_list', 1), 'test3');
  t.same(msg.getFromListAt('string_list', 2), 'test1');
  t.true(msg.isInList('string_list', 'test1'));
  t.true(msg.isInList('string_list', 'test2'));
  t.true(msg.isInList('string_list', 'test3'));

  t.same(msg.getFromListAt('string_list', 0), 'test2');
  msg.removeFromListAt('string_list', 0);
  t.same(msg.getFromListAt('string_list', 0), 'test3');
  msg.removeFromListAt('string_list', 0);
  t.same(msg.getFromListAt('string_list', 0), 'test1');
  msg.removeFromListAt('string_list', 0);
  t.true(msg.hasClearedField('string_list'));
  t.same(msg.getClearedFields(), ['string_list']);
  t.same(msg.get('string_list', ['what']), ['what']);

  msg.addToList('string_list', ['test1', 'test2']);
  // ensure we can't modify the internal array
  const myList = msg.get('string_list');
  t.false(myList === msg.get('string_list'));
  t.same(myList, ['test1', 'test2']);
  myList.push('test3');
  t.same(myList, ['test1', 'test2', 'test3']);
  t.same(msg.get('string_list'), ['test1', 'test2']);

  t.end();
});


test('Message message_list tests', (t) => {
  const msg = SampleMessageV1.create();
  const otherMsg1 = SampleOtherMessageV1.create().set('test', 'test1');
  const otherMsg2 = SampleOtherMessageV1.create().set('test', 'test2');
  const otherMsg3 = SampleOtherMessageV1.create().set('test', 'test3');

  t.false(msg.has('message_list'));
  t.false(msg.hasClearedField('message_list'));

  msg.addToList('message_list', [otherMsg1, otherMsg2]);
  t.true(msg.has('message_list'));
  t.same(msg.get('message_list'), [otherMsg1, otherMsg2]);
  t.same(msg.get('message_list', ['default']), [otherMsg1, otherMsg2]);
  t.same(msg.getFromListAt('message_list', 0), otherMsg1);
  t.same(msg.getFromListAt('message_list', 1), otherMsg2);
  t.same(msg.getFromListAt('message_list', 0, 'default'), otherMsg1);
  t.same(msg.getFromListAt('message_list', 1, 'default'), otherMsg2);
  t.same(msg.getFromListAt('message_list', 2, 'default'), 'default');
  t.true(msg.isInList('message_list', otherMsg1));
  t.true(msg.isInList('message_list', otherMsg2));
  t.false(msg.isInList('message_list', otherMsg3));

  msg.addToList('message_list', [otherMsg3]);
  t.same(msg.get('message_list'), [otherMsg1, otherMsg2, otherMsg3]);
  t.same(msg.getFromListAt('message_list', 2, 'default'), otherMsg3);
  t.true(msg.isInList('message_list', otherMsg1));
  t.true(msg.isInList('message_list', otherMsg2));
  t.true(msg.isInList('message_list', otherMsg3));

  msg.removeFromListAt('message_list', 0);
  t.same(msg.get('message_list'), [otherMsg2, otherMsg3]);
  t.same(msg.getFromListAt('message_list', 0), otherMsg2);
  t.same(msg.getFromListAt('message_list', 1), otherMsg3);
  t.false(msg.isInList('message_list', otherMsg1));
  t.true(msg.isInList('message_list', otherMsg2));
  t.true(msg.isInList('message_list', otherMsg3));

  msg.addToList('message_list', [otherMsg1]);
  t.same(msg.get('message_list'), [otherMsg2, otherMsg3, otherMsg1]);
  t.same(msg.getFromListAt('message_list', 0), otherMsg2);
  t.same(msg.getFromListAt('message_list', 1), otherMsg3);
  t.same(msg.getFromListAt('message_list', 2), otherMsg1);
  t.true(msg.isInList('message_list', otherMsg1));
  t.true(msg.isInList('message_list', otherMsg2));
  t.true(msg.isInList('message_list', otherMsg3));

  t.same(msg.getFromListAt('message_list', 0), otherMsg2);
  msg.removeFromListAt('message_list', 0);
  t.same(msg.getFromListAt('message_list', 0), otherMsg3);
  msg.removeFromListAt('message_list', 0);
  t.same(msg.getFromListAt('message_list', 0), otherMsg1);
  msg.removeFromListAt('message_list', 0);
  t.true(msg.hasClearedField('message_list'));
  t.same(msg.getClearedFields(), ['message_list']);
  t.same(msg.get('message_list', ['what']), ['what']);

  msg.addToList('message_list', [otherMsg1, otherMsg2]);
  // ensure we can't modify the internal array
  const myList = msg.get('message_list');
  t.false(myList === msg.get('message_list'));
  t.same(myList, [otherMsg1, otherMsg2]);
  myList.push(otherMsg3);
  t.same(myList, [otherMsg1, otherMsg2, otherMsg3]);
  t.same(msg.get('message_list'), [otherMsg1, otherMsg2]);

  t.end();
});
