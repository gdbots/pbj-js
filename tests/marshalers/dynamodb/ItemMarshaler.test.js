import test from 'tape';
import DynamicField from '../../../src/well-known/DynamicField';
import GeoPoint from '../../../src/well-known/GeoPoint';
import MessageRef from '../../../src/MessageRef';
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
    _schema: { S: 'pbj:gdbots:pbj.tests::sample-message:1-0-0' },
    mixin_int: { N: '0' },
    string_single: { S: 'test' },
    string_set: { SS: ['set1', 'set2'] },
    string_list: { L: [{ S: 'list1' }, { S: 'list2' }] },
    string_map: { M: { key1: { S: 'val1' }, key2: { S: 'val2' } } },
    message_single: {
      M: {
        _schema: { S: 'pbj:gdbots:pbj.tests::sample-other-message:1-0-0' },
        mixin_int: { N: '0' },
        test: { S: 'single' },
      },
    },
    message_list: {
      L: [{
        M: {
          _schema: { S: 'pbj:gdbots:pbj.tests::sample-other-message:1-0-0' },
          mixin_int: { N: '0' },
          test: { S: 'list' },
        },
      }],
    },
    message_map: {
      M: {
        test: {
          M: {
            _schema: { S: 'pbj:gdbots:pbj.tests::sample-other-message:1-0-0' },
            mixin_int: { N: '0' },
            test: { S: 'map' },
          },
        },
      },
    },
  };

  t.same(ItemMarshaler.marshal(message), obj);

  t.end();
});

test('ItemMarshaler unmarshal tests', (t) => {
  const message = SampleMessageV1.create()
    .set('string_single', 'test')
    .addToSet('string_set', ['set1', 'set2'])
    .set('message_single', SampleOtherMessageV1.create().set('test', 'single'))
    .addToList('message_list', [SampleOtherMessageV1.create().set('test', 'list')])
    .addToMap('message_map', 'test', SampleOtherMessageV1.create().set('test', 'map'));

  t.true(message.equals(ItemMarshaler.unmarshal(ItemMarshaler.marshal(message))));

  t.end();
});

test('ItemMarshaler encode/decode Message tests', (t) => {
  const message = SampleMessageV1.create()
    .set('string_single', 'test');

  const obj = {
    M: {
      _schema: { S: 'pbj:gdbots:pbj.tests::sample-message:1-0-0' },
      mixin_int: { N: '0' },
      string_single: { S: 'test' },
    },
  };

  t.same(ItemMarshaler.encodeMessage(message), obj);
  t.true(message.equals(ItemMarshaler.decodeMessage(ItemMarshaler.marshal(message))));

  t.end();
});

test('ItemMarshaler encode/decode MessageRef tests', (t) => {
  const obj = { curie: 'acme:blog:node:article', id: '123', tag: 'tag' };
  const dynamoObj = { curie: { S: 'acme:blog:node:article' }, id: { S: '123' }, tag: { S: 'tag' } };
  const ref = MessageRef.fromObject(obj);

  t.same(ref, ItemMarshaler.decodeMessageRef(dynamoObj));
  t.same(dynamoObj, ItemMarshaler.encodeMessageRef(ref).M);
  t.true(ref.equals(ItemMarshaler.decodeMessageRef(ItemMarshaler.encodeMessageRef(ref).M)));

  t.end();
});

test('ItemMarshaler encode/decode GeoPoint tests', (t) => {
  const obj = { type: 'Point', coordinates: [102, 0.5] };
  const dynamoObj = {
    type: { S: 'Point' },
    coordinates: {
      L: [{ N: 102 }, { N: 0.5 }],
    },
  };
  const geoPoint = GeoPoint.fromObject(obj);

  t.same(ItemMarshaler.encodeGeoPoint(geoPoint).M, dynamoObj);
  t.true(geoPoint.equals(ItemMarshaler.decodeGeoPoint(dynamoObj)));

  t.end();
});

test('ItemMarshaler encode/decode DynamicField tests', (t) => {
  const obj = { name: 'test', bool_val: true };
  const dynamoObj = { name: { S: 'test' }, bool_val: { BOOL: true } };
  const df = DynamicField.fromObject(obj);

  t.same(ItemMarshaler.encodeDynamicField(df).M, dynamoObj);
  t.true(df.equals(ItemMarshaler.decodeDynamicField(dynamoObj)));

  t.end();
});
