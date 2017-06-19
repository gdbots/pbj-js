import test from 'tape';
import SampleMessageV1 from './Fixtures/SampleMessageV1';

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
