'use strict';

import {expect} from 'chai'
import EmailMessage from '../../fixtures/email-message';
import FixtureLoader from '../../fixtures/fixture-loader';
import ItemMarshaler from 'gdbots/pbj/marshaler/dynamo-db/item-marshaler.js';

describe('item-marshaler-test', function() {
  it('marshal', function(done) {
    let message = FixtureLoader.createEmailMessage();
    let marshaler = new ItemMarshaler();

    let expected = {
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
        "S": "test" // "donuts,mmmm,chicken test"
      },
      "priority": {
        "N": "2"
      },
      "sent": {
        "BOOL": false
      },
      "date_sent": {
        "S": "2014-12-25T12:12:00.123Z"
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

    let actual = marshaler.marshal(message);

    expected.should.eql(actual);

    done();
  });

/*
  it('unmarshal', function(done) {
    let expected = FixtureLoader.createEmailMessage();
    let marshaler = new ItemMarshaler();

    let item = FixtureLoader.getSerializer().deserialize('{"_schema":"pbj:gdbots:tests.pbj:fixtures:email-message:1-0-0","id":"0dcee564-aa71-11e4-a811-3c15c2c60168","from_name":"homer","from_email":"homer@thesimpsons.com","subject":"test","priority":2,"sent":false,"date_sent":"2014-12-25T12:12:00.123Z","microtime_sent":"1422122017734617","provider":"gmail","labels":["donuts","mmmm","chicken"],"nested":{"_schema":"pbj:gdbots:tests.pbj:fixtures:nested-message:1-0-0","test1":"val1","test2":[1,2],"location":{"type":"Point","coordinates":[102,0.5]},"refs":[{"curie":"gdbots:tests.pbj:fixtures:email-message","id":"0dcee564-aa71-11e4-a811-3c15c2c60168","tag":"parent"}]},"enum_in_set":["aol","gmail"],"enum_in_list":["aol","aol","gmail","gmail"],"any_of_message":[{"_schema":"pbj:gdbots:tests.pbj:fixtures:maps-message:1-0-0"},{"_schema":"pbj:gdbots:tests.pbj:fixtures:nested-message:1-0-0","test1":"value1"}],"dynamic_fields":[{"name":"bool_val","bool_val":true},{"name":"date_val","date_val":"2017-01-03"},{"name":"float_val","float_val":3.14},{"name":"int_val","int_val":100},{"name":"string_val","string_val":"string"},{"name":"text_val","text_val":"text"}]}');
    let actual = marshaler.unmarshal(item);

    expected.shoud.eql(actual);

    done();
  });
*/
});
