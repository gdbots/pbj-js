'use strict';

import Enum from 'gdbots/common/enum';

/**
 * @method static TypeName BIG_INT()
 * @method static TypeName BINARY()
 * @method static TypeName BLOB()
 * @method static TypeName BOOLEAN()
 * @method static TypeName DATE()
 * @method static TypeName DATE_TIME()
 * @method static TypeName DECIMAL()
 * @method static TypeName FLOAT()
 * @method static TypeName GEO_POINT()
 * @method static TypeName IDENTIFIER()
 * @method static TypeName INT()
 * @method static TypeName INT_ENUM()
 * @method static TypeName MEDIUM_BLOB()
 * @method static TypeName MEDIUM_INT()
 * @method static TypeName MEDIUM_TEXT()
 * @method static TypeName MESSAGE()
 * @method static TypeName MESSAGE_REF()
 * @method static TypeName MICROTIME()
 * @method static TypeName SIGNED_BIG_INT()
 * @method static TypeName SIGNED_INT()
 * @method static TypeName SIGNED_MEDIUM_INT()
 * @method static TypeName SIGNED_SMALL_INT()
 * @method static TypeName SIGNED_TINY_INT()
 * @method static TypeName SMALL_INT()
 * @method static TypeName STRING()
 * @method static TypeName STRING_ENUM()
 * @method static TypeName TEXT()
 * @method static TypeName TIME_UUID()
 * @method static TypeName TIMESTAMP()
 * @method static TypeName TINY_INT()
 * @method static TypeName UUID()
 */
export default class TypeName extends Enum {}

TypeName.initEnum({
  BIG_INT: 'big-int',
  BINARY: 'binary',
  BLOB: 'blob',
  BOOLEAN: 'boolean',
  DATE: 'date',
  DATE_TIME: 'date-time',
  DECIMAL: 'decimal',
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
  UUID: 'uuid'
});
