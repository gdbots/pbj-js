'use strict';

import ToArray from 'gdbots/common/to-array';
import ArrayUtils from 'gdbots/common/util/array-utils';
import NumberUtils from 'gdbots/common/util/number-utils';
import Enum from 'gdbots/common/enum';
import Identifier from 'gdbots/identifiers/identifier';
import TypeName from 'gdbots/pbj/enum/type-name';
import FieldRule from 'gdbots/pbj/enum/field-rule';
import Format from 'gdbots/pbj/enum/format';
import Type from 'gdbots/pbj/type/type';

/**
 * Regular expression pattern for matching a valid field name. The pattern allows
 * for camelCase fields name but snake_case is recommend.
 *
 * @constant string
 */
export const VALID_NAME_PATTERN = /^[a-zA-Z_]{1}[a-zA-Z0-9_]*/;

export default class Field extends ToArray
{
  /**
   * @param string      name
   * @param Type        type
   * @param FieldRule   rule
   * @param bool        required
   * @param null|int    minLength
   * @param null|int    maxLength
   * @param null|string pattern
   * @param null|string format
   * @param null|int    min
   * @param null|int    max
   * @param int         precision
   * @param int         scale
   * @param null|mixed  defaultValue
   * @param bool        useTypeDefault
   * @param null|string className
   * @param null|array  anyOfClassNames
   * @param bool        overridable
   */
  constructor(
    name,
    type,
    rule = null,
    required = false,
    minLength = null,
    maxLength = null,
    pattern = null,
    format = null,
    min = null,
    max = null,
    precision = 10,
    scale = 2,
    defaultValue = null,
    useTypeDefault = true,
    className = null,
    anyOfClassNames = null,
    assertion = null,
    overridable = false
  ) {
    super(); // require before using `this`

    if (1 > name.length || name.length > 127) {
      throw new Error('Name length must be between 1 to 127.');
    }
    if (!VALID_NAME_PATTERN.test(name)) {
      throw new Error('Field [' + name + '] must match pattern [' + VALID_NAME_PATTERN + '].');
    }
    if (!type || !(type instanceof Type)) {
      throw new Error('Class "' + type + '" was expected to be instanceof of "Type" but is not.');
    }
    if ('boolean' !== typeof required) {
      throw new Error('Required value must be boolean.');
    }
    if ('boolean' !== typeof useTypeDefault) {
      throw new Error('UseTypeDefault value must be boolean.');
    }
    if ('boolean' !== typeof overridable) {
      throw new Error('Overridable value must be boolean.');
    }

    /*
     * a message type allows for interfaces to be used
     * as the "className". so long as the provided argument
     * passes the instanceof check it's okay.
     */
    if (type.getTypeName() !== TypeName.MESSAGE) {

      // anyOf is only supported on nested messages
      anyOfClassNames = null;
    }

    /** @var string */
    this.name = name;

    /** @var Type */
    this.type = type;

    /** @var bool */
    this.required = required || false;

    /** @var bool */
    this.useTypeDefault = useTypeDefault;

    /** @var string */
    this.className = className;

    /** @var array */
    this.anyOfClassNames = anyOfClassNames;

    /** @var \Closure */
    this.assertion = assertion;

    /** @var bool */
    this.overridable = overridable || false;

    applyFieldRule.bind(this)(rule);
    applyStringOptions.bind(this)(minLength, maxLength, pattern, format);
    applyNumericOptions.bind(this)(min, max, precision, scale);
    applyDefault.bind(this)(defaultValue);
  }

  /**
   * @return string
   */
  getName() {
    return this.name;
  }

  /**
   * @return Type
   */
  getType() {
    return this.type;
  }

  /**
   * @return FieldRule
   */
  getRule() {
    return this.rule;
  }

  /**
   * @return bool
   */
  isASingleValue() {
    return FieldRule.A_SINGLE_VALUE === this.rule;
  }

  /**
   * @return bool
   */
  isASet() {
    return FieldRule.A_SET === this.rule;
  }

  /**
   * @return bool
   */
  isAList() {
    return FieldRule.A_LIST === this.rule;
  }

  /**
   * @return bool
   */
  isAMap() {
    return FieldRule.A_MAP === this.rule;
  }

  /**
   * @return bool
   */
  isRequired() {
    return this.required;
  }

  /**
   * @return int
   */
  getMinLength() {
    return this.minLength || 0;
  }

  /**
   * @return int
   */
  getMaxLength() {
    if (!this.maxLength) {
      return this.type.getMaxBytes();
    }

    return this.maxLength;
  }

  /**
   * @return string
   */
  getPattern() {
    return this.pattern;
  }

  /**
   * @return Format
   */
  getFormat() {
    return this.format;
  }

  /**
   * @return int
   */
  getMin() {
    if (!this.min) {
      return this.type.getMin();
    }

    return this.min;
  }

  /**
   * @return int
   */
  getMax() {
    if (!this.max) {
      return this.type.getMax();
    }

    return this.max;
  }

  /**
   * @return int
   */
  getPrecision() {
    return this.precision;
  }

  /**
   * @return int
   */
  getScale() {
    return this.scale;
  }

  /**
   * @param Message message
   *
   * @return mixed
   */
  getDefault(message = null) {
    if (null === this.defaultValue) {
      if (this.useTypeDefault) {
        return this.isASingleValue() ? this.type.getDefault() : [];
      }

      return this.isASingleValue() ? null : [];
    }

    if ('function' === typeof this.defaultValue) {
      let defaultValue = this.defaultValue(message, this);

      guardDefault.bind(this)(defaultValue);

      if (null === defaultValue) {
        if (this.useTypeDefault) {
          return this.isASingleValue() ? this.type.getDefault() : [];
        }

        return this.isASingleValue() ? null : [];
      }

      return defaultValue;
    }


    return this.defaultValue;
  }

  /**
   * @return bool
   */
  hasClassName() {
    return null !== this.className;
  }

  /**
   * @return string
   */
  getClassName() {
    return this.className;
  }

  /**
   * @return bool
   */
  hasAnyOfClassNames() {
    return null !== this.anyOfClassNames;
  }

  /**
   * @return array
   */
  getAnyOfClassNames() {
    return this.anyOfClassNames;
  }

  /**
   * @return bool
   */
  isOverridable() {
    return this.overridable;
  }

  /**
   * @param mixed value
   *
   * @throws AssertionFailed
   * @throws \Exception
   */
  guardValue(value) {
    if (this.required && null === value) {
      throw new Error('Field [' + this.name + '] is required and cannot be null.');
    }

    if (null !== value) {
      this.type.guard(value, this);
    }

    if (null !== this.assertion) {
      this.assertion(value, this);
    }
  }

  /**
   * @return array
   */
  toArray() {
    return {
      'name': this.name,
      'type': this.type.getTypeValue(),
      'rule': this.rule.getName(),
      'required': this.required,
      'min_length': this.minLength,
      'max_length': this.maxLength,
      'pattern': this.pattern,
      'format': this.format.getValue(),
      'min': this.min,
      'max': this.max,
      'precision': this.precision,
      'scale': this.scale,
      'default': this.getDefault(),
      'use_type_default': this.useTypeDefault,
      'class_name': this.className,
      'any_of_class_names': this.anyOfClassNames,
      'has_assertion': null !== this.assertion,
      'overridable': this.overridable,
    };
  }

  /**
   * @return array
   */
  jsonSerialize() {
    return this.toArray();
  }

  /**
   * Returns true if this field is likely compatible with the
   * provided field during a mergeFrom operation.
   *
   * @param Field other
   *
   * @return bool
   */
  isCompatibleForMerge(other) {
    if (this.name !== other.name) {
      return false;
    }

    if (this.type !== other.type) {
      return false;
    }

    if (this.rule !== other.rule) {
      return false;
    }

    if (this.className !== other.className) {
      return false;
    }

    if (this.anyOfClassNames.filter(function(k) {
        return other.anyOfClassNames.indexOf(k) != -1;
    }).length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Returns true if the provided field can be used as an
   * override to this field.
   *
   * @param Field other
   *
   * @return bool
   */
  isCompatibleForOverride(other) {
    if (!this.overridable) {
      return false;
    }

    if (this.name !== other.name) {
      return false;
    }

    if (this.type !== other.type) {
      return false;
    }

    if (this.rule !== other.rule) {
      return false;
    }

    if (this.required !== other.required) {
      return false;
    }

    return true;
  }
}

/**
 * @param FieldRule rule
 *
 * @throws AssertionFailed
 */
function applyFieldRule(rule = null) {

  /** @var FieldRule */
  this.rule = rule || FieldRule.A_SINGLE_VALUE;

  if (this.isASet() && !this.type.allowedInSet()) {
    throw new Error('Field [' + this.name + '] with type [' + this.type.getTypeValue() + '] cannot be used in a set.');
  }
}

/**
 * @param null|int    minLength
 * @param null|int    maxLength
 * @param null|string pattern
 * @param null|string format
 */
function applyStringOptions(minLength = null, maxLength = null, pattern = null, format = null) {

  /** @var int */
  this.minLength = parseInt(minLength);

  /** @var int */
  this.maxLength = parseInt(maxLength);

  if (maxLength > 0) {
    this.maxLength = maxLength;
    this.minLength = NumberUtils.bound(minLength, 0, this.maxLength);
  } else {
    // arbitrary string minimum range
    this.minLength = NumberUtils.bound(minLength, 0, this.type.getMaxBytes());
  }

  /**
   * A regular expression to match against for string types.
   * @link http://spacetelescope.github.io/understanding-json-schema/reference/string.html#pattern
   *
   * @var string
   */
  if (null !== pattern) {
    this.pattern = '/' + pattern.trim().replace('/', '') + '/';
  }

  /**
   * @link http://spacetelescope.github.io/understanding-json-schema/reference/string.html#format
   *
   * @var Format
   */
  if (null !== format && Format.enumValueOf(format)) {
    this.format = Format.enumValueOf(format);
  } else {
    this.format = Format.UNKNOWN;
  }
}

/**
 * @param null|int min
 * @param null|int max
 * @param int      precision
 * @param int      scale
 */
function applyNumericOptions(min = null, max = null, precision = 10, scale = 2) {
  /** @var int */
  if (null !== max) {
    this.max = parseInt(max);
  }

  /** @var int */
  if (null !== min) {
    this.min = parseInt(min);
    if (null !== this.max) {
      if (this.min > this.max) {
        this.min = this.max;
      }
    }
  }

   /** @var int */
  this.precision = NumberUtils.bound(parseInt(precision), 1, 65);

   /** @var int */
  this.scale = NumberUtils.bound(parseInt(scale), 0, this.precision)
}

/**
 * @param mixed defaultValue
 *
 * @throws AssertionFailed
 * @throws \Exception
 */
function applyDefault(defaultValue = null) {
  /** @var mixed */
  this.defaultValue = defaultValue;

  if (this.type.isScalar()) {
    if (this.type.getTypeName() !== TypeName.TIMESTAMP) {
      this.useTypeDefault = true;
    }
  } else {
    let decodeDefault = null !== this.defaultValue && 'function' !== typeof this.defaultValue;

    switch (this.type.getTypeName()) {
      case TypeName.IDENTIFIER:
        if (null === this.className) {
          throw new Error('Field [' + this.className + '] requires a className.');
        }

        if (decodeDefault && !(this.defaultValue instanceof Identifier)) {
          this.defaultValue = this.type.decode(this.defaultValue, this);
        }
        break;

      case TypeName.INT_ENUM:
      case TypeName.STRING_ENUM:
        if (null === this.className) {
          throw new Error('Field [' + this.className + '] requires a className.');
        }

        if (decodeDefault && !(this.defaultValue instanceof Enum)) {
          this.defaultValue = this.type.decode(this.defaultValue, this);
        }
        break;

      default:
        break;
    }
  }

  if (null !== this.defaultValue && 'function' !== typeof this.defaultValue) {
    guardDefault.bind(this)(this.defaultValue);
  }
}

/**
 * @param mixed defaultValue
 *
 * @throws AssertionFailed
 * @throws \Exception
 */
function guardDefault(defaultValue) {
  if (this.isASingleValue()) {
    this.guardValue(defaultValue);

    return;
  }

  if (null !== defaultValue || !Array.isArray(defaultValue)) {
    throw new Error('Field [' + this.name + '] default must be an array.');
  }

  if (null === defaultValue) {
    return;
  }

  if (this.isAMap()) {
    if (!ArrayUtils.isAssoc(defaultValue)) {
      throw new Error('Field [' + this.name + '] default must be an associative array.');
    }
  }

  ArrayUtils.each(defaultValue, function(value, key) {
    if (null === value) {
      throw new Error('Field [' + this.name + '] default for key [' + value + '] cannot be null.');
    }

    this.guardValue(value);
  }.bind(this));
}
