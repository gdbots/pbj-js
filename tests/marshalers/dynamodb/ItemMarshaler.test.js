import test from 'tape';
import Fb from '../../../src/FieldBuilder';
import DynamicField from '../../../src/well-known/DynamicField';
import GeoPoint from '../../../src/well-known/GeoPoint';
import MessageRef from '../../../src/MessageRef';
import T from '../../../src/types';
import ItemMarshaler from '../../../src/marshalers/dynamodb/ItemMarshaler';
import SampleMessageV1 from '../../fixtures/SampleMessageV1';
import SampleOtherMessageV1 from '../../fixtures/SampleOtherMessageV1';

test('ItemMarshaler marshal tests', (t) => {
  const message = SampleMessageV1.create()
    .set('string_single', 'test')
    .addToSet('string_set', ['set1', 'set2'])
    .addToList('string_list', ['list1', 'list2'])
    .addToMap('string_map', 'key1', 'val1')
    .addToMap('string_map', 'key2', 'val2')
    .set('message_single', SampleOtherMessageV1.create().set('test', 'single'))
    .addToList('message_list', [SampleOtherMessageV1.create().set('test', 'list')])
    .addToMap('message_map', 'test', SampleOtherMessageV1.create().set('test', 'map'));

  const obj = {
    _schema: 'pbj:gdbots:pbj.tests::sample-message:1-0-0',
    mixin_int: 0,
    string_single: 'test',
    string_set: ['set1', 'set2'],
    string_list: ['list1', 'list2'],
    string_map: { key1: 'val1', key2: 'val2'},
    message_single: {
      _schema: 'pbj:gdbots:pbj.tests::sample-other-message:1-0-0',
      mixin_int: 0,
      test: 'single',
    },
    message_list: [
      {
        _schema: 'pbj:gdbots:pbj.tests::sample-other-message:1-0-0',
        mixin_int: 0,
        test: 'list',
      },
    ],
    message_map: {
      test: {
        _schema: 'pbj:gdbots:pbj.tests::sample-other-message:1-0-0',
        mixin_int: 0,
        test: 'map',
      },
    },
  };

t.same(ItemMarshaler.marshal(message), obj);

t.end();
});