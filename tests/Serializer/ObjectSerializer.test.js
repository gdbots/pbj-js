import test from 'tape';
import Fb from '../../src/FieldBuilder';
import DynamicField from '../../src/WellKnown/DynamicField';
import GeoPoint from '../../src/WellKnown/GeoPoint';
import MessageRef from '../../src/MessageRef';
import T from '../../src/Type';
import ObjectSerializer from '../../src/Serializer/ObjectSerializer';
import SampleMessageV1 from '../Fixtures/SampleMessageV1';
import SampleOtherMessageV1 from '../Fixtures/SampleOtherMessageV1';

test('ObjectSerializer serialize tests', (t) => {
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
    string_map: { key1: 'val1', key2: 'val2' },
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

  t.same(ObjectSerializer.serialize(message), obj);

  t.end();
});


test('ObjectSerializer deserialize tests', (t) => {
  const message = SampleMessageV1.create()
    .addToList('string_list', ['list1', 'list2'])
    .set('string_single', 'test')
    .addToSet('string_set', ['set1', 'set2'])
    .addToMap('string_map', 'key1', 'val1')
    .addToMap('string_map', 'key2', 'val2')
    .set('message_single', SampleOtherMessageV1.create().set('test', 'single'))
    .addToList('message_list', [SampleOtherMessageV1.create().set('test', 'list')])
    .addToMap('message_map', 'test', SampleOtherMessageV1.create().set('test', 'map'));

  t.true(message.equals(ObjectSerializer.deserialize(ObjectSerializer.serialize(message))));

  t.end();
});


test('ObjectSerializer encode/decode Message tests', (t) => {
  const message = SampleMessageV1.create();
  const field = message.schema().getField('string_single');
  const obj = {
    _schema: 'pbj:gdbots:pbj.tests::sample-message:1-0-0',
    mixin_int: 0,
  };

  t.same(ObjectSerializer.encodeMessage(message, field), obj);
  t.true(message.equals(ObjectSerializer.decodeMessage(obj, field)));

  t.end();
});


test('ObjectSerializer encode/decode MessageRef tests', (t) => {
  const obj = { curie: 'acme:blog:node:article', id: '123', tag: 'tag' };
  const ref = MessageRef.fromObject(obj);
  const field = Fb.create('test', T.MessageRefType.create()).build();

  t.same(ObjectSerializer.encodeMessageRef(ref, field), obj);
  t.true(ref.equals(ObjectSerializer.decodeMessageRef(obj, field)));

  t.end();
});


test('ObjectSerializer encode/decode GeoPoint tests', (t) => {
  const obj = { type: 'Point', coordinates: [102, 0.5] };
  const geoPoint = GeoPoint.fromObject(obj);
  const field = Fb.create('test', T.GeoPointType.create()).build();

  t.same(ObjectSerializer.encodeGeoPoint(geoPoint, field), obj);
  t.true(geoPoint.equals(ObjectSerializer.decodeGeoPoint(obj, field)));

  t.end();
});


test('ObjectSerializer encode/decode DynamicField tests', (t) => {
  const obj = { name: 'test', bool_val: true };
  const df = DynamicField.fromObject(obj);
  const field = Fb.create('test', T.DynamicFieldType.create()).build();

  t.same(ObjectSerializer.encodeDynamicField(df, field), obj);
  t.true(df.equals(ObjectSerializer.decodeDynamicField(obj, field)));

  t.end();
});
