import Enum from '@gdbots/common/Enum';

class TypeName extends Enum {}

TypeName.configure({
  BIG_INT: 'big-int',
  BINARY: 'binary',
  BLOB: 'blob',
  BOOLEAN: 'boolean',
  DATE: 'date',
  DATE_TIME: 'date-time',
  DECIMAL: 'decimal',
  DYNAMIC_FIELD: 'dynamic-field',
  FLOAT: 'float',
  GEO_POINT: 'geo-point',
  IDENTIFIER: 'identifier',
  INT: 'int',
  INT_ENUM: 'int-enum',
  MEDIUM_BLOB: 'medium-blob',
  MEDIUM_INT: 'medium-int',
  MEDIUM_TEXT: 'medium-text',
  MESSAGE: 'message',
  MESSAGE_REF: 'message-ref',
  MICROTIME: 'microtime',
  SIGNED_BIG_INT: 'signed-big-int',
  SIGNED_INT: 'signed-int',
  SIGNED_MEDIUM_INT: 'signed-medium-int',
  SIGNED_SMALL_INT: 'signed-small-int',
  SIGNED_TINY_INT: 'signed-tiny-int',
  SMALL_INT: 'small-int',
  STRING: 'string',
  STRING_ENUM: 'string-enum',
  TEXT: 'text',
  TIME_UUID: 'time-uuid',
  TIMESTAMP: 'timestamp',
  TINY_INT: 'tiny-int',
  TRINARY: 'trinary',
  UUID: 'uuid'
}, 'gdbots:pbj:type-name');

export default TypeName;