'use strict';

import ArrayUtils from 'gdbots/common/util/array-utils';
import SlugUtils from 'gdbots/common/util/slug-utils';
import StringUtils from 'gdbots/common/util/string-utils';
import Format from 'gdbots/pbj/enum/format';
import Field from 'gdbots/pbj/field';
import Message from 'gdbots/pbj/message';
import MessageResolver from 'gdbots/pbj/message-resolver';
import SchemaId from 'gdbots/pbj/schema-id';
import {PBJ_FIELD_NAME, Schema} from 'gdbots/pbj/schema';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class MappingFactory
{
  constructor() {
    privateProps.set(this, {
      /**
       * During the creation of a mapping any string types that are indexed will
       * use the "standard" analyzer unless something else is specified.
       *
       * @link https://www.elastic.co/guide/en/elasticsearch/guide/current/custom-analyzers.html
       *
       * @var string
       */
      defaultAnalyzer: null,

      /**
       * Map of pbj type -> elastica mapping types.
       *
       * @var array
       */
      types: {
        'big-int': {
          'type': 'long',
          'include_in_all': false
        },
        'binary': {
          'type': 'binary'
        },
        'blob': {
          'type': 'binary'
        },
        'boolean': {
          'type': 'boolean',
          'include_in_all': false
        },
        'date': {
          'type': 'date',
          'include_in_all': false
        },
        'date-time': {
          'type': 'date',
          'include_in_all': false
        },
        'decimal': {
          'type': 'double',
          'include_in_all': false
        },
        'dynamic-field': {
          'type': 'object',
          'properties': {
            'name': {
              'type': 'string',
              'index': 'not_analyzed',
              'include_in_all': false
            },
            'bool_val': {
              'type': 'boolean',
              'include_in_all': false
            },
            'date_val': {
              'type': 'date',
              'include_in_all': false
            },
            'float_val': {
              'type': 'float',
              'include_in_all': false
            },
            'int_val': {
              'type': 'long',
              'include_in_all': false
            },
            'string_val': {
              'type': 'string'
            },
            'text_val': {
              'type': 'string'
            }
          }
        },
        'float': {
          'type': 'float',
          'include_in_all': false
        },
        'geo-point': {
          'type': 'geo_point',
          'include_in_all': false
        },
        'identifier': {
          'type': 'string',
          'index': 'not_analyzed',
          'include_in_all': false
        },
        'int': {
          'type': 'long',
          'include_in_all': false
        },
        'int-enum': {
          'type': 'integer',
          'include_in_all': false
        },
        'medium-blob': {
          'type': 'binary'
        },
        'medium-int': {
          'type': 'integer',
          'include_in_all': false
        },
        'medium-text': {
          'type': 'string'
        },
        'message': {
          'type': 'object'
        },
        'message-ref': {
          'type': 'object',
          'properties': {
            'curie': {
              'type': 'string',
              'index': 'not_analyzed',
              'include_in_all': false
            },
            'id': {
              'type': 'string',
              'index': 'not_analyzed',
              'include_in_all': false
            },
            'tag': {
              'type': 'string',
              'index': 'not_analyzed',
              'include_in_all': false
            }
          }
        },
        'microtime': {
          'type': 'long',
          'include_in_all': false
        },
        'signed-big-int': {
          'type': 'long',
          'include_in_all': false
        },
        'signed-int': {
          'type': 'integer',
          'include_in_all': false
        },
        'signed-medium-int': {
          'type': 'long',
          'include_in_all': false
        },
        'signed-small-int': {
          'type': 'short',
          'include_in_all': false
        },
        'signed-tiny-int': {
          'type': 'byte',
          'include_in_all': false
        },
        'small-int': {
          'type': 'integer',
          'include_in_all': false
        },
        'string': {
          'type': 'string'
        },
        'string-enum': {
          'type': 'string',
          'index': 'not_analyzed',
          'include_in_all': false
        },
        'text': {
          'type': 'string'
        },
        'time-uuid': {
          'type': 'string',
          'index': 'not_analyzed',
          'include_in_all': false
        },
        'timestamp': {
          'type': 'date',
          'include_in_all': false
        },
        'tiny-int': {
          'type': 'short',
          'include_in_all': false
        },
        'trinary': {
          'type': 'short',
          'include_in_all': false
        },
        'uuid': {
          'type': 'string',
          'index': 'not_analyzed',
          'include_in_all': false
        }
      }
    });
  }

  /**
   * Returns the custom analyzers that an index will need to when indexing some
   * pbj fields/types when certain options are used (urls, hashtag format, etc.)
   *
   * @link http://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-custom-analyzer.html
   *
   * @return array
   */
  static getCustomAnalyzers() {
    return {
      'pbj_keyword_analyzer': {
        'tokenizer': 'keyword',
        'filter': 'lowercase'
      }
    };
  }

  /**
   * @param Schema schema
   * @param string defaultAnalyzer
   *
   * @return array
   */
  create(schema, defaultAnalyzer = null) {
    privateProps.get(this).defaultAnalyzer = defaultAnalyzer;

    let rootObject = {};
    rootObject.dynamic_templates = [];

    let mapping = {
      properties: this.mapSchema(schema, rootObject)
    };

    ArrayUtils.each(rootObject, function(v, k) {
      if (v) {
        mapping[k] = v;
      }
    }.bind(mapping));

    return mapping;
  }

  /**
   * @param Schema    schema
   * @param \stdClass rootObject
   * @param string    path
   *
   * @return array
   */
  mapSchema(schema, rootObject, path = null) {
    let map = {};

    ArrayUtils.each(schema.getFields(), function(field) {
      let fieldName = field.getName();
      let type = field.getType();
      let fieldPath = !path || path.length === 0 ? fieldName : path + '.' + fieldName;

      if (fieldName === PBJ_FIELD_NAME) {
        map[fieldName] = {
          'type': 'string',
          'index': 'not_analyzed',
          'include_in_all': false
        };
        return;
      }

      let method = StringUtils.toCamelCase(type.getTypeValue());
      method = 'map' + method.substring(0, 1).toUpperCase() + method.substring(1);

      if (field.isAMap()) {
        let templateItem = {};
        let templateName = SlugUtils.create(fieldPath + '-template').replace('-', '_');

        if ('function' == typeof this[method]) {
          templateItem[templateName] = {
            'path_match': fieldPath + '.*',
            'mapping': this[method](field, rootObject, fieldPath)
          };
        } else {
          templateItem[templateName] = {
            'path_match': fieldPath + '.*',
            'mapping': this.applyAnalyzer(
              privateProps.get(this).types[type.getTypeValue()],
              field,
              rootObject,
              path
            )
          };
        }

        rootObject.dynamic_templates.push(templateItem);
      } else {
        if ('function' == typeof this[method]) {
          map[fieldName] = this[method](field, rootObject, fieldPath);
        } else {
          map[fieldName] = this.applyAnalyzer(
            privateProps.get(this).types[type.getTypeValue()],
            field,
            rootObject,
            path
          );
        }
      }
    }.bind(this));

    return map;
  }

  /**
   * @link https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html
   *
   * @param Field     field
   * @param \stdClass rootObject
   * @param string    path
   *
   * @return array
   */
  mapMessage(field, rootObject, path = null) {
    try {
      let schema = field.getInstance().schema();

      return {
        'type': field.isAList() ? 'nested' : 'object',
        'properties': this.mapSchema(schema, rootObject, path)
      };
    } catch (e) {}

    let properties = {};
    properties[PBJ_FIELD_NAME] = {
      'type': 'string',
      'index': 'not_analyzed',
      'include_in_all': false
    };

    return {
      'type': field.isAList() ? 'nested' : 'object',
      'properties': properties
    };
  }

  /**
   * @link https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html
   *
   * @param Field     field
   * @param \stdClass rootObject
   * @param string    path
   *
   * @return array
   */
  mapDynamicField(field, rootObject, path = null) {
    let mapping = privateProps.get(this).types[field.getType().getTypeValue()];

    if (field.isAList()) {
      mapping.type = 'nested';
    }

    mapping.properties.string_val = this.applyAnalyzer(
      mapping.properties.string_val, field, rootObject, path
    );

    mapping.properties.text_val = this.applyAnalyzer(
      mapping.properties.text_val, field, rootObject, path
    );

    return mapping;
  }

  /**
   * @param Field     field
   * @param \stdClass rootObject
   * @param string    path
   *
   * @return array
   */
  mapString(field, rootObject, path = null) {
    switch (field.getFormat()) {
      case Format.DATE:
      case Format.DATE_TIME:
        return privateProps.get(this).types['date-time'];

      /**
       * String fields with these formats should use "pbj_keyword_analyzer" (or something similar)
       * so searches on these fields are not case sensitive.
       *
       * @link http://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-custom-analyzer.html
       * @link http://stackoverflow.com/questions/15079064/how-to-setup-a-tokenizer-in-elasticsearch
       */
      case Format.SLUG:
      case Format.EMAIL:
      case Format.HOSTNAME:
      case Format.IPV6:
      case Format.UUID:
      case Format.URI:
      case Format.HASHTAG:
        return {
          'type': 'string',
          'analyzer': 'pbj_keyword_analyzer',
          'include_in_all': false
        };

      case Format.IPV4:
        return {
          'type': 'ip',
          'include_in_all': false
        };

      case Format.URL:
        return {
          'type': 'string',
          'index': 'no',
          'include_in_all': false
        };

      default:
        if (field.getPattern()) {
          return {
            'type': 'string',
            'analyzer': 'pbj_keyword_analyzer',
            'include_in_all': false
          };
        }

        return this.applyAnalyzer({'type': 'string'}, field, rootObject, path);
    }
  }

  /**
   * Modify the analyzer for a property prior to adding it to the document mapping.
   * This is only applied to "string" types.
   *
   * @param array     mapping
   * @param Field     field
   * @param \stdClass rootObject
   * @param null      path
   *
   * @return array
   */
  applyAnalyzer(mapping, field, rootObject, path = null) {
    if (null === privateProps.get(this).defaultAnalyzer) {
      return mapping;
    }

    if (undefined === mapping.type || 'string' != mapping.type) {
      return mapping;
    }

    if (undefined !== mapping.index && 'analyzed' != mapping.index) {
      return mapping;
    }

    if (undefined !== mapping.analyzer) {
      return mapping;
    }

    mapping.analyzer = privateProps.get(this).defaultAnalyzer;

    return mapping;
  }
}
