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
    .set('_schema', 'pbj:gdbots:tests.pbj:fixtures:email-message:1-0-0')
    .set('id', '0dcee564-aa71-11e4-a811-3c15c2c60168')
    .set('from_name', 'homer')
    .set('from_email', 'homer@thesimpsons.com')
    .set('subject', 'donuts,mmmm,chicken test')
    .set('priority', 2)
    .set('sent', false)
    .set('date_sent', '2014-12-25T12:12:00.123456Z')
    .set('microtime_sent', '1422122017734617')
    .set('provider', 'gmail')
    .addToSet('labels', ['donuts', 'mmmm', 'chicken'])
    .addToList('string_list', ['list1', 'list2'])
    .addToMap('string_map', 'key1', 'val1')
    .addToMap('string_map', 'key2', 'val2')
    .set('message_single', SampleOtherMessageV1.create().set('test', 'single'))
    .addToList('message_list', [SampleOtherMessageV1.create().set('test', 'list')])
    .addToMap('message_map', 'test', SampleOtherMessageV1.create().set('test', 'map'));

  const json = {
    "_schema": {
      "S": "pbj:gdbots:tests.pbj:fixtures:email-message:1-0-0"
    },
    "id": {
      "S": "0dcee564-aa71-11e4-a811-3c15c2c60168"
    },
    "from_name": {
      "S": "homer"
    },
    "from_email": {
      "S": "homer@thesimpsons.com"
    },
    "subject": {
      "S": "donuts,mmmm,chicken test"
    },
    "priority": {
      "N": "2"
    },
    "sent": {
      "BOOL": false
    },
    "date_sent": {
      "S": "2014-12-25T12:12:00.123456Z"
    },
    "microtime_sent": {
      "N": "1422122017734617"
    },
    "provider": {
      "S": "gmail"
    },
    "labels": {
      "SS": [
        "donuts",
        "mmmm",
        "chicken"
      ]
    },
    "nested": {
      "M": {
        "_schema": {
          "S": "pbj:gdbots:tests.pbj:fixtures:nested-message:1-0-0"
        },
        "test1": {
          "S": "val1"
        },
        "test2": {
          "NS": [
            "1",
            "2"
          ]
        },
        "location": {
          "M": {
            "type": {
              "S": "Point"
            },
            "coordinates": {
              "L": [
                {
                  "N": "102"
                },
                {
                  "N": "0.5"
                }
              ]
            }
          }
        },
        "refs": {
          "L": [
            {
              "M": {
                "curie": {
                  "S": "gdbots:tests.pbj:fixtures:email-message"
                },
                "id": {
                  "S": "0dcee564-aa71-11e4-a811-3c15c2c60168"
                },
                "tag": {
                  "S": "parent"
                }
              }
            }
          ]
        }
      }
    },
    "enum_in_set": {
      "SS": [
        "aol",
        "gmail"
      ]
    },
    "enum_in_list": {
      "L": [
        {
          "S": "aol"
        },
        {
          "S": "aol"
        },
        {
          "S": "gmail"
        },
        {
          "S": "gmail"
        }
      ]
    },
    "any_of_message": {
      "L": [
        {
          "M": {
            "_schema": {
              "S": "pbj:gdbots:tests.pbj:fixtures:maps-message:1-0-0"
            },
            "String": {
              "M": {
                "test:field:name": {
                  "S": "value1"
                }
              }
            }
          }
        },
        {
          "M": {
            "_schema": {
              "S": "pbj:gdbots:tests.pbj:fixtures:nested-message:1-0-0"
            },
            "test1": {
              "S": "value1"
            }
          }
        }
      ]
    },
    "dynamic_fields": {
      "L": [
        {
          "M": {
            "name": {
              "S": "bool_val"
            },
            "bool_val": {
              "BOOL": true
            }
          }
        },
        {
          "M": {
            "name": {
              "S": "date_val"
            },
            "date_val": {
              "S": "2015-12-25"
            }
          }
        },
        {
          "M": {
            "name": {
              "S": "float_val"
            },
            "float_val": {
              "N": "3.14"
            }
          }
        },
        {
          "M": {
            "name": {
              "S": "int_val"
            },
            "int_val": {
              "N": "100"
            }
          }
        },
        {
          "M": {
            "name": {
              "S": "string_val"
            },
            "string_val": {
              "S": "string"
            }
          }
        },
        {
          "M": {
            "name": {
              "S": "text_val"
            },
            "text_val": {
              "S": "text"
            }
          }
        }
      ]
    }
  };

t.same(ItemMarshaler.marshal(message), json);

t.end();
});