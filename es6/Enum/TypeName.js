function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Enum from '@gdbots/common/es6/Enum';

var TypeName = function (_Enum) {
  _inherits(TypeName, _Enum);

  function TypeName() {
    _classCallCheck(this, TypeName);

    return _possibleConstructorReturn(this, (TypeName.__proto__ || Object.getPrototypeOf(TypeName)).apply(this, arguments));
  }

  return TypeName;
}(Enum);

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