'use strict';

import {expect} from 'chai';
import EmailMessage from '../../fixtures/email-message';
import MapsMessage from '../../fixtures/maps-message';
import MappingFactory from 'gdbots/pbj/marshaler/elastica/mapping-factory.js';

describe('mapping-factory-test', function() {
  it('create', function(done) {
    let factory = new MappingFactory();

    let schema = EmailMessage.schema();
    let mapping = factory.create(schema, 'english');

    getExpectedEmailMapping().should.eql(mapping);

    schema = MapsMessage.schema();
    mapping = factory.create(schema, 'english');

    getExpectedMapsMapping().should.eql(mapping);

    done();
  });
});

function getExpectedEmailMapping() {
  return {
    "dynamic_templates": [],
    "properties": {
      "_schema": {
        "type": "string",
        "index": "not_analyzed",
        "include_in_all": false
      },
      "id": {
        "type": "string",
        "index": "not_analyzed",
        "include_in_all": false
      },
      "from_name": {
        "type": "string",
        "analyzer": "english"
      },
      "from_email": {
        "type": "string",
        "analyzer": "english"
      },
      "subject": {
        "type": "string",
        "analyzer": "english"
      },
      "body": {
        "type": "string",
        "analyzer": "english"
      },
      "priority": {
        "type": "integer",
        "include_in_all": false
      },
      "sent": {
        "type": "boolean",
        "include_in_all": false
      },
      "date_sent": {
        "type": "date",
        "include_in_all": false
      },
      "microtime_sent": {
        "type": "long",
        "include_in_all": false
      },
      "provider": {
        "type": "string",
        "index": "not_analyzed",
        "include_in_all": false
      },
      "labels": {
        "type": "string",
        "analyzer": "english"
      },
      "nested": {
        "type": "object",
        "properties": {
          "_schema": {
            "type": "string",
            "index": "not_analyzed",
            "include_in_all": false
          },
          "test1": {
            "type": "string",
            "analyzer": "english"
          },
          "test2": {
            "type": "long",
            "include_in_all": false
          },
          "location": {
            "type": "geo_point",
            "include_in_all": false
          },
          "refs": {
            "type": "object",
            "properties": {
              "curie": {
                "type": "string",
                "index": "not_analyzed",
                "include_in_all": false
              },
              "id": {
                "type": "string",
                "index": "not_analyzed",
                "include_in_all": false
              },
              "tag": {
                "type": "string",
                "index": "not_analyzed",
                "include_in_all": false
              }
            }
          }
        }
      },
      "enum_in_set": {
        "type": "string",
        "index": "not_analyzed",
        "include_in_all": false
      },
      "enum_in_list": {
        "type": "string",
        "index": "not_analyzed",
        "include_in_all": false
      },
      "any_of_message": {
        "type": "nested",
        "properties": {
          "_schema": {
            "type": "string",
            "index": "not_analyzed",
            "include_in_all": false
          }
        }
      },
      "dynamic_fields": {
        "type": "nested",
        "properties": {
          "name": {
            "type": "string",
            "index": "not_analyzed",
            "include_in_all": false
          },
          "bool_val": {
            "type": "boolean",
            "include_in_all": false
          },
          "date_val": {
            "type": "date",
            "include_in_all": false
          },
          "float_val": {
            "type": "float",
            "include_in_all": false
          },
          "int_val": {
            "type": "long",
            "include_in_all": false
          },
          "string_val": {
            "type": "string",
            "analyzer": "english"
          },
          "text_val": {
            "type": "string",
            "analyzer": "english"
          }
        }
      }
    }
  };
}

function getExpectedMapsMapping() {
  return {
    "properties": {
      "_schema": {
        "type": "string",
        "index": "not_analyzed",
        "include_in_all": false
      }
    },
    "dynamic_templates": [
      {
        "bigint_template": {
          "path_match": "BigInt.*",
          "mapping": {
            "type": "long",
            "include_in_all": false
          }
        }
      },
      {
        "binary_template": {
          "path_match": "Binary.*",
          "mapping": {
            "type": "binary"
          }
        }
      },
      {
        "blob_template": {
          "path_match": "Blob.*",
          "mapping": {
            "type": "binary"
          }
        }
      },
      {
        "boolean_template": {
          "path_match": "Boolean.*",
          "mapping": {
            "type": "boolean",
            "include_in_all": false
          }
        }
      },
      {
        "datetime_template": {
          "path_match": "DateTime.*",
          "mapping": {
            "type": "date",
            "include_in_all": false
          }
        }
      },
      {
        "date_template": {
          "path_match": "Date.*",
          "mapping": {
            "type": "date",
            "include_in_all": false
          }
        }
      },
      {
        "decimal_template": {
          "path_match": "Decimal.*",
          "mapping": {
            "type": "double",
            "include_in_all": false
          }
        }
      },
      {
        "dynamicfield_template": {
          "path_match": "DynamicField.*",
          "mapping": {
            "type": "nested",
            "properties": {
              "name": {
                "type": "string",
                "index": "not_analyzed",
                "include_in_all": false
              },
              "bool_val": {
                "type": "boolean",
                "include_in_all": false
              },
              "date_val": {
                "type": "date",
                "include_in_all": false
              },
              "float_val": {
                "type": "float",
                "include_in_all": false
              },
              "int_val": {
                "type": "long",
                "include_in_all": false
              },
              "string_val": {
                "type": "string",
                "analyzer": "english"
              },
              "text_val": {
                "type": "string",
                "analyzer": "english"
              }
            }
          }
        }
      },
      {
        "float_template": {
          "path_match": "Float.*",
          "mapping": {
            "type": "float",
            "include_in_all": false
          }
        }
      },
      {
        "geopoint_template": {
          "path_match": "GeoPoint.*",
          "mapping": {
            "type": "geo_point",
            "include_in_all": false
          }
        }
      },
      {
        "identifier_template": {
          "path_match": "Identifier.*",
          "mapping": {
            "type": "string",
            "index": "not_analyzed",
            "include_in_all": false
          }
        }
      },
      {
        "intenum_template": {
          "path_match": "IntEnum.*",
          "mapping": {
            "type": "integer",
            "include_in_all": false
          }
        }
      },
      {
        "int_template": {
          "path_match": "Int.*",
          "mapping": {
            "type": "long",
            "include_in_all": false
          }
        }
      },
      {
        "mediumblob_template": {
          "path_match": "MediumBlob.*",
          "mapping": {
            "type": "binary"
          }
        }
      },
      {
        "mediumint_template": {
          "path_match": "MediumInt.*",
          "mapping": {
            "type": "integer",
            "include_in_all": false
          }
        }
      },
      {
        "mediumtext_template": {
          "path_match": "MediumText.*",
          "mapping": {
            "type": "string",
            "analyzer": "english"
          }
        }
      },
      {
        "messageref_template": {
          "path_match": "MessageRef.*",
          "mapping": {
            "type": "object",
            "properties": {
              "curie": {
                "type": "string",
                "index": "not_analyzed",
                "include_in_all": false
              },
              "id": {
                "type": "string",
                "index": "not_analyzed",
                "include_in_all": false
              },
              "tag": {
                "type": "string",
                "index": "not_analyzed",
                "include_in_all": false
              }
            }
          }
        }
      },
      {
        "message_template": {
          "path_match": "Message.*",
          "mapping": {
            "type": "object",
            "properties": {
              "_schema": {
                "type": "string",
                "index": "not_analyzed",
                "include_in_all": false
              },
              "test1": {
                "type": "string",
                "analyzer": "english"
              },
              "test2": {
                "type": "long",
                "include_in_all": false
              },
              "location": {
                "type": "geo_point",
                "include_in_all": false
              },
              "refs": {
                "type": "object",
                "properties": {
                  "curie": {
                    "type": "string",
                    "index": "not_analyzed",
                    "include_in_all": false
                  },
                  "id": {
                    "type": "string",
                    "index": "not_analyzed",
                    "include_in_all": false
                  },
                  "tag": {
                    "type": "string",
                    "index": "not_analyzed",
                    "include_in_all": false
                  }
                }
              }
            }
          }
        }
      },
      {
        "microtime_template": {
          "path_match": "Microtime.*",
          "mapping": {
            "type": "long",
            "include_in_all": false
          }
        }
      },
      {
        "signedbigint_template": {
          "path_match": "SignedBigInt.*",
          "mapping": {
            "type": "long",
            "include_in_all": false
          }
        }
      },
      {
        "signedint_template": {
          "path_match": "SignedInt.*",
          "mapping": {
            "type": "integer",
            "include_in_all": false
          }
        }
      },
      {
        "signedmediumint_template": {
          "path_match": "SignedMediumInt.*",
          "mapping": {
            "type": "long",
            "include_in_all": false
          }
        }
      },
      {
        "signedsmallint_template": {
          "path_match": "SignedSmallInt.*",
          "mapping": {
            "type": "short",
            "include_in_all": false
          }
        }
      },
      {
        "signedtinyint_template": {
          "path_match": "SignedTinyInt.*",
          "mapping": {
            "type": "byte",
            "include_in_all": false
          }
        }
      },
      {
        "smallint_template": {
          "path_match": "SmallInt.*",
          "mapping": {
            "type": "integer",
            "include_in_all": false
          }
        }
      },
      {
        "stringenum_template": {
          "path_match": "StringEnum.*",
          "mapping": {
            "type": "string",
            "index": "not_analyzed",
            "include_in_all": false
          }
        }
      },
      {
        "string_template": {
          "path_match": "String.*",
          "mapping": {
            "type": "string",
            "analyzer": "english"
          }
        }
      },
      {
        "text_template": {
          "path_match": "Text.*",
          "mapping": {
            "type": "string",
            "analyzer": "english"
          }
        }
      },
      {
        "timeuuid_template": {
          "path_match": "TimeUuid.*",
          "mapping": {
            "type": "string",
            "index": "not_analyzed",
            "include_in_all": false
          }
        }
      },
      {
        "timestamp_template": {
          "path_match": "Timestamp.*",
          "mapping": {
            "type": "date",
            "include_in_all": false
          }
        }
      },
      {
        "tinyint_template": {
          "path_match": "TinyInt.*",
          "mapping": {
            "type": "short",
            "include_in_all": false
          }
        }
      },
      {
        "uuid_template": {
          "path_match": "Uuid.*",
          "mapping": {
            "type": "string",
            "index": "not_analyzed",
            "include_in_all": false
          }
        }
      }
    ]
  };
}
