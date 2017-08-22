import test from 'tape';
import DynamicField from '../../../src/well-known/DynamicField';
import GeoPoint from '../../../src/well-known/GeoPoint';
import MessageRef from '../../../src/MessageRef';
import ItemMarshaler from '../../../src/marshalers/dynamodb/ItemMarshaler';
import SampleMessageV1 from '../../fixtures/SampleMessageV1';
import SampleOtherMessageV1 from '../../fixtures/SampleOtherMessageV1';


const message = SampleMessageV1.create()
  .set('string_single', 'test')
  .addToSet('string_set', ['set1', 'set2'])
  .addToList('string_list', ['list1', 'list2'])
  .addToMap('string_map', 'key1', 'val1')
  .addToMap('string_map', 'key2', 'val2')

  .set('message_single', SampleOtherMessageV1.create().set('test', 'single'))
  .addToList('message_list', [
    SampleOtherMessageV1.create().set('test', 'list_item1'),
    SampleOtherMessageV1.create().set('test', 'list_item2'),
  ])
  .addToMap('message_map', 'test1', SampleOtherMessageV1.create().set('test', 'map_item1'))
  .addToMap('message_map', 'test2', SampleOtherMessageV1.create().set('test', 'map_item2'))

  .set('message_ref_single', MessageRef.fromString('acme:blog:node:article:id1#tag'))
  .addToSet('message_ref_set', [
    MessageRef.fromString('acme:blog:node:article:set_id1'),
    MessageRef.fromString('acme:blog:node:article:set_id2'),
  ])
  .addToList('message_ref_list', [
    MessageRef.fromString('acme:blog:node:article:list_id1'),
    MessageRef.fromString('acme:blog:node:article:list_id2'),
  ])
  .addToMap('message_ref_map', 'test1', MessageRef.fromString('acme:blog:node:article:map_id1'))
  .addToMap('message_ref_map', 'test2', MessageRef.fromString('acme:blog:node:article:map_id2'))

  .set('geo_point_single', new GeoPoint(0.4, 101.0))
  .addToList('geo_point_list', [
    new GeoPoint(0.5, 102.0),
    new GeoPoint(0.6, 103.0),
  ])
  .addToMap('geo_point_map', 'test1', new GeoPoint(0.7, 104.0))
  .addToMap('geo_point_map', 'test2', new GeoPoint(0.8, 105.0))

  .set('dynamic_field_single', DynamicField.createStringVal('test_string', 'string'))
  .addToList('dynamic_field_list', [
    DynamicField.createBoolVal('test_bool', true),
    DynamicField.createDateVal('test_date', new Date(Date.UTC(2015, 11, 25))),
    DynamicField.createFloatVal('test_float', 3.14),
    DynamicField.createIntVal('test_int', 9000),
    DynamicField.createTextVal('test_text', 'text'),
  ])
  .addToMap('dynamic_field_map', 'test1', DynamicField.createStringVal('test_string', 'string'))
  .addToMap('dynamic_field_map', 'test2', DynamicField.createIntVal('test_int', 9000))
;


test('ItemMarshaler marshal/unmarshal tests', (t) => {
  const obj = {
    _schema: {
      S: 'pbj:gdbots:pbj.tests::sample-message:1-0-0',
    },
    mixin_int: {
      N: '0',
    },
    string_single: {
      S: 'test',
    },
    string_set: {
      SS: [
        'set1',
        'set2',
      ],
    },
    string_list: {
      L: [
        {
          S: 'list1',
        },
        {
          S: 'list2',
        },
      ],
    },
    string_map: {
      M: {
        key1: {
          S: 'val1',
        },
        key2: {
          S: 'val2',
        },
      },
    },
    message_single: {
      M: {
        _schema: {
          S: 'pbj:gdbots:pbj.tests::sample-other-message:1-0-0',
        },
        mixin_int: {
          N: '0',
        },
        test: {
          S: 'single',
        },
      },
    },
    message_list: {
      L: [
        {
          M: {
            _schema: {
              S: 'pbj:gdbots:pbj.tests::sample-other-message:1-0-0',
            },
            mixin_int: {
              N: '0',
            },
            test: {
              S: 'list_item1',
            },
          },
        },
        {
          M: {
            _schema: {
              S: 'pbj:gdbots:pbj.tests::sample-other-message:1-0-0',
            },
            mixin_int: {
              N: '0',
            },
            test: {
              S: 'list_item2',
            },
          },
        },
      ],
    },
    message_map: {
      M: {
        test1: {
          M: {
            _schema: {
              S: 'pbj:gdbots:pbj.tests::sample-other-message:1-0-0',
            },
            mixin_int: {
              N: '0',
            },
            test: {
              S: 'map_item1',
            },
          },
        },
        test2: {
          M: {
            _schema: {
              S: 'pbj:gdbots:pbj.tests::sample-other-message:1-0-0',
            },
            mixin_int: {
              N: '0',
            },
            test: {
              S: 'map_item2',
            },
          },
        },
      },
    },
    message_ref_single: {
      M: {
        curie: {
          S: 'acme:blog:node:article',
        },
        id: {
          S: 'id1',
        },
        tag: {
          S: 'tag',
        },
      },
    },
    message_ref_set: {
      L: [
        {
          M: {
            curie: {
              S: 'acme:blog:node:article',
            },
            id: {
              S: 'set_id1',
            },
            tag: {
              NULL: true,
            },
          },
        },
        {
          M: {
            curie: {
              S: 'acme:blog:node:article',
            },
            id: {
              S: 'set_id2',
            },
            tag: {
              NULL: true,
            },
          },
        },
      ],
    },
    message_ref_list: {
      L: [
        {
          M: {
            curie: {
              S: 'acme:blog:node:article',
            },
            id: {
              S: 'list_id1',
            },
            tag: {
              NULL: true,
            },
          },
        },
        {
          M: {
            curie: {
              S: 'acme:blog:node:article',
            },
            id: {
              S: 'list_id2',
            },
            tag: {
              NULL: true,
            },
          },
        },
      ],
    },
    message_ref_map: {
      M: {
        test1: {
          M: {
            curie: {
              S: 'acme:blog:node:article',
            },
            id: {
              S: 'map_id1',
            },
            tag: {
              NULL: true,
            },
          },
        },
        test2: {
          M: {
            curie: {
              S: 'acme:blog:node:article',
            },
            id: {
              S: 'map_id2',
            },
            tag: {
              NULL: true,
            },
          },
        },
      },
    },
    geo_point_single: {
      M: {
        type: {
          S: 'Point',
        },
        coordinates: {
          L: [
            {
              N: '101',
            },
            {
              N: '0.4',
            },
          ],
        },
      },
    },
    geo_point_list: {
      L: [
        {
          M: {
            type: {
              S: 'Point',
            },
            coordinates: {
              L: [
                {
                  N: '102',
                },
                {
                  N: '0.5',
                },
              ],
            },
          },
        },
        {
          M: {
            type: {
              S: 'Point',
            },
            coordinates: {
              L: [
                {
                  N: '103',
                },
                {
                  N: '0.6',
                },
              ],
            },
          },
        },
      ],
    },
    geo_point_map: {
      M: {
        test1: {
          M: {
            type: {
              S: 'Point',
            },
            coordinates: {
              L: [
                {
                  N: '104',
                },
                {
                  N: '0.7',
                },
              ],
            },
          },
        },
        test2: {
          M: {
            type: {
              S: 'Point',
            },
            coordinates: {
              L: [
                {
                  N: '105',
                },
                {
                  N: '0.8',
                },
              ],
            },
          },
        },
      },
    },
    dynamic_field_single: {
      M: {
        name: {
          S: 'test_string',
        },
        string_val: {
          S: 'string',
        },
      },
    },
    dynamic_field_list: {
      L: [
        {
          M: {
            name: {
              S: 'test_bool',
            },
            bool_val: {
              BOOL: true,
            },
          },
        },
        {
          M: {
            name: {
              S: 'test_date',
            },
            date_val: {
              S: '2015-12-25',
            },
          },
        },
        {
          M: {
            name: {
              S: 'test_float',
            },
            float_val: {
              N: '3.14',
            },
          },
        },
        {
          M: {
            name: {
              S: 'test_int',
            },
            int_val: {
              N: '9000',
            },
          },
        },
        {
          M: {
            name: {
              S: 'test_text',
            },
            text_val: {
              S: 'text',
            },
          },
        },
      ],
    },
    dynamic_field_map: {
      M: {
        test1: {
          M: {
            name: {
              S: 'test_string',
            },
            string_val: {
              S: 'string',
            },
          },
        },
        test2: {
          M: {
            name: {
              S: 'test_int',
            },
            int_val: {
              N: '9000',
            },
          },
        },
      },
    },
  };

  const field = message.schema().getField('message_single');
  t.same(ItemMarshaler.marshal(message), obj);
  // t.same(JSON.stringify(ItemMarshaler.marshal(message)), JSON.stringify(obj));
  t.same(ItemMarshaler.encodeMessage(message, field), { M: obj });
  t.true(message.equals(ItemMarshaler.unmarshal(ItemMarshaler.marshal(message))));
  t.true(message.equals(ItemMarshaler.decodeMessage(obj, field)));

  t.end();
});


test('ItemMarshaler encode/decode MessageRef tests', (t) => {
  const field = message.schema().getField('message_ref_single');
  const obj = { curie: 'acme:blog:node:article', id: '123', tag: 'tag' };
  const ref = MessageRef.fromObject(obj);
  const ddb = {
    M: {
      curie: {
        S: 'acme:blog:node:article',
      },
      id: {
        S: '123',
      },
      tag: {
        S: 'tag',
      },
    },
  };

  t.same(ItemMarshaler.encodeMessageRef(ref, field), ddb);
  t.true(ref.equals(ItemMarshaler.decodeMessageRef(ddb.M, field)));

  t.end();
});


test('ItemMarshaler encode/decode GeoPoint tests', (t) => {
  const field = message.schema().getField('geo_point_single');
  const obj = { type: 'Point', coordinates: [102, 0.5] };
  const geoPoint = GeoPoint.fromObject(obj);
  const ddb = {
    M: {
      type: {
        S: 'Point',
      },
      coordinates: {
        L: [
          {
            N: '102',
          },
          {
            N: '0.5',
          },
        ],
      },
    },
  };

  t.same(ItemMarshaler.encodeGeoPoint(geoPoint, field), ddb);
  t.true(geoPoint.equals(ItemMarshaler.decodeGeoPoint(ddb.M, field)));

  t.end();
});


test('ItemMarshaler encode/decode DynamicField tests', (t) => {
  const field = message.schema().getField('dynamic_field_single');
  const obj = { name: 'test', bool_val: true };
  const df = DynamicField.fromObject(obj);
  const ddb = {
    M: {
      name: {
        S: 'test',
      },
      bool_val: {
        BOOL: true,
      },
    },
  };

  t.same(ItemMarshaler.encodeDynamicField(df, field), ddb);
  t.true(df.equals(ItemMarshaler.decodeDynamicField(ddb.M, field)));

  t.end();
});
