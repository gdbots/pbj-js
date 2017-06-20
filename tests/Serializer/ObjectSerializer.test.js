import test from 'tape';
import ObjectSerializer from '../../src/Serializer/ObjectSerializer';
import SampleMessageV1 from './../Fixtures/SampleMessageV1';

test('ObjectSerializer tests', (t) => {
  const message = SampleMessageV1.create()
    .set('string_single', 'test')
    .addToSet('string_set', ['set1', 'set2'])
    .addToList('string_list', ['list1', 'list2'])
    .addToMap('string_map', 'key1', 'val1')
    .addToMap('string_map', 'key2', 'val2');

  t.same(ObjectSerializer.serialize(message), {
    _schema: 'pbj:gdbots:pbj.tests::sample-message:1-0-0',
    mixin_int: 0,
    string_single: 'test',
    string_set: ['set1', 'set2'],
    string_list: ['list1', 'list2'],
    string_map: { key1: 'val1', key2: 'val2' },
  });

  t.end();
});
