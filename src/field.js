'use strict';

import ToArray from 'gdbots/common/to-array';
import ArrayUtils from 'gdbots/common/util/array-utils';
import NumberUtils from 'gdbots/common/util/number-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import TypeName from 'gdbots/pbj/enum/type-name';
import FieldRule from 'gdbots/pbj/enum/field-rule';
import Format from 'gdbots/pbj/enum/format';

/**
 * Regular expression pattern for matching a valid field name. The pattern allows
 * for camelCase fields name but snake_case is recommend.
 *
 * @constant string
 */
export const VALID_NAME_PATTERN = /^[a-zA-Z_]{1}[a-zA-Z0-9_]*/;

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class Field extends SystemUtils.mixinClass(null, ToArray)
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
   * @param null|string instance
   * @param null|array  anyOfInstances
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
    instance = null,
    anyOfInstances = null,
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
    if (!type || !type.hasTrait('Type')) {
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
     * as the "instance". so long as the provided argument
     * passes the instanceof check it's okay.
     */
    if (type.getTypeName() !== TypeName.MESSAGE) {

      // anyOf is only supported on nested messages
      anyOfInstances = null;
    }

    privateProps.set(this, {
      /** @var string */
      name: name,

      /** @var Type */
      type: type,

      /** @var FieldRule */
      rule: null,

      /** @var bool */
      required: required || false,

      /** @var int */
      minLength: null,

      /** @var int */
      maxLength: null,

      /**
       * A regular expression to match against for string types.
       * @link http://spacetelescope.github.io/understanding-json-schema/reference/string.html#pattern
       *
       * @var string
       */
      pattern: null,

      /**
       * @link http://spacetelescope.github.io/understanding-json-schema/reference/string.html#format
       *
       * @var Format
       */
      format: null,

      /** @var int */
      min: null,

      /** @var int */
      max: null,

      /** @var int */
      precision: 10,

      /** @var int */
      scale: 2,

      /** @var mixed */
      defaultValue: null,

      /** @var bool */
      useTypeDefault: useTypeDefault,

      /** @var string */
      instance: instance,

      /** @var array */
      anyOfInstances: anyOfInstances,

      /** @var \Closure */
      assertion: assertion,

      /** @var bool */
      overridable: overridable || false
    });

    applyFieldRule.bind(this)(rule);
    applyStringOptions.bind(this)(minLength, maxLength, pattern, format);
    applyNumericOptions.bind(this)(min, max, precision, scale);
    applyDefault.bind(this)(defaultValue);
  }

  /**
   * @return string
   */
  getName() {
    return privateProps.get(this).name;
  }

  /**
   * @return Type
   */
  getType() {
    return privateProps.get(this).type;
  }

  /**
   * @return FieldRule
   */
  getRule() {
    return privateProps.get(this).rule;
  }

  /**
   * @return bool
   */
  isASingleValue() {
    return FieldRule.A_SINGLE_VALUE === privateProps.get(this).rule;
  }

  /**
   * @return bool
   */
  isASet() {
    return FieldRule.A_SET === privateProps.get(this).rule;
  }

  /**
   * @return bool
   */
  isAList() {
    return FieldRule.A_LIST === privateProps.get(this).rule;
  }

  /**
   * @return bool
   */
  isAMap() {
    return FieldRule.A_MAP === privateProps.get(this).rule;
  }

  /**
   * @return bool
   */
  isRequired() {
    return privateProps.get(this).required;
  }

  /**
   * @return int
   */
  getMinLength() {
    return privateProps.get(this).minLength || 0;
  }

  /**
   * @return int
   */
  getMaxLength() {
    if (!privateProps.get(this).maxLength) {
      return privateProps.get(this).type.getMaxBytes();
    }

    return privateProps.get(this).maxLength;
  }

  /**
   * @return string
   */
  getPattern() {
    return privateProps.get(this).pattern;
  }

  /**
   * @return Format
   */
  getFormat() {
    return privateProps.get(this).format;
  }

  /**
   * @return int
   */
  getMin() {
    if (!privateProps.get(this).min) {
      return privateProps.get(this).type.getMin();
    }

    return privateProps.get(this).min;
  }

  /**
   * @return int
   */
  getMax() {
    if (!privateProps.get(this).max) {
      return privateProps.get(this).type.getMax();
    }

    return privateProps.get(this).max;
  }

  /**
   * @return int
   */
  getPrecision() {
    return privateProps.get(this).precision;
  }

  /**
   * @return int
   */
  getScale() {
    return privateProps.get(this).scale;
  }

  /**
   * @param Message message
   *
   * @return mixed
   */
  getDefault(message = null) {
    if (null === privateProps.get(this).defaultValue) {
      if (privateProps.get(this).useTypeDefault) {
        return this.isASingleValue() ? privateProps.get(this).type.getDefault() : [];
      }

      return this.isASingleValue() ? null : [];
    }

    if ('function' === typeof privateProps.get(this).defaultValue) {
      let defaultValue = privateProps.get(this).defaultValue(message, this);

      guardDefault.bind(this)(defaultValue);

      if (null === defaultValue) {
        if (privateProps.get(this).useTypeDefault) {
          return this.isASingleValue() ? privateProps.get(this).type.getDefault() : [];
        }

        return this.isASingleValue() ? null : [];
      }

      return defaultValue;
    }


    return privateProps.get(this).defaultValue;
  }

  /**
   * @return bool
   */
  hasInstance() {
    return null !== privateProps.get(this).instance;
  }

  /**
   * @return string
   */
  getInstance() {
    return privateProps.get(this).instance;
  }

  /**
   * @return bool
   */
  hasAnyOfInstances() {
    return null !== privateProps.get(this).anyOfInstances;
  }

  /**
   * @return array
   */
  getAnyOfInstances() {
    return privateProps.get(this).anyOfInstances;
  }

  /**
   * @return bool
   */
  isOverridable() {
    return privateProps.get(this).overridable;
  }

  /**
   * @param mixed value
   *
   * @throws AssertionFailed
   * @throws \Exception
   */
  guardValue(value) {
    if (privateProps.get(this).required && null === value) {
      throw new Error('Field [' + privateProps.get(this).name + '] is required and cannot be null.');
    }

    if (null !== value) {
      privateProps.get(this).type.guard(value, this);
    }

    if (null !== privateProps.get(this).assertion) {
      privateProps.get(this).assertion(value, this);
    }
  }

  /**
   * @return array
   */
  toArray() {
    return {
      'name': privateProps.get(this).name,
      'type': privateProps.get(this).type.getTypeValue(),
      'rule': privateProps.get(this).rule.getName(),
      'required': privateProps.get(this).required,
      'min_length': privateProps.get(this).minLength,
      'max_length': privateProps.get(this).maxLength,
      'pattern': privateProps.get(this).pattern,
      'format': privateProps.get(this).format.getValue(),
      'min': privateProps.get(this).min,
      'max': privateProps.get(this).max,
      'precision': privateProps.get(this).precision,
      'scale': privateProps.get(this).scale,
      'default': this.getDefault(),
      'use_type_default': privateProps.get(this).useTypeDefault,
      'instance': privateProps.get(this).instance,
      'any_of_instances': privateProps.get(this).anyOfInstances,
      'has_assertion': null !== privateProps.get(this).assertion,
      'overridable': privateProps.get(this).overridable,
    };
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
    if (privateProps.get(this).name !== other.name) {
      return false;
    }

    if (privateProps.get(this).type !== other.type) {
      return false;
    }

    if (privateProps.get(this).rule !== other.rule) {
      return false;
    }

    if (privateProps.get(this).instance !== other.instance) {
      return false;
    }

    if (privateProps.get(this).anyOfInstances.filter(function(k) {
        return other.anyOfInstances.indexOf(k) != -1;
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
    if (!privateProps.get(this).overridable) {
      return false;
    }

    if (privateProps.get(this).name !== other.name) {
      return false;
    }

    if (privateProps.get(this).type !== other.type) {
      return false;
    }

    if (privateProps.get(this).rule !== other.rule) {
      return false;
    }

    if (privateProps.get(this).required !== other.required) {
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
  privateProps.get(this).rule = rule || FieldRule.A_SINGLE_VALUE;

  if (this.isASet() && !privateProps.get(this).type.allowedInSet()) {
    throw new Error('Field [' + privateProps.get(this).name + '] with type [' + privateProps.get(this).type.getTypeValue() + '] cannot be used in a set.');
  }
}

/**
 * @param null|int    minLength
 * @param null|int    maxLength
 * @param null|string pattern
 * @param null|string format
 */
function applyStringOptions(minLength = null, maxLength = null, pattern = null, format = null) {
  privateProps.get(this).minLength = parseInt(minLength);
  privateProps.get(this).maxLength = parseInt(maxLength);

  if (maxLength > 0) {
    privateProps.get(this).maxLength = maxLength;
    privateProps.get(this).minLength = NumberUtils.bound(minLength, 0, privateProps.get(this).maxLength);
  } else {
    // arbitrary string minimum range
    privateProps.get(this).minLength = NumberUtils.bound(minLength, 0, privateProps.get(this).type.getMaxBytes());
  }

  if (null !== pattern) {
    privateProps.get(this).pattern = pattern.trim().replace('/', '');
  }

  if (null !== format && Format.enumValueOf(format)) {
    privateProps.get(this).format = Format.enumValueOf(format);
  } else {
    privateProps.get(this).format = Format.UNKNOWN;
  }
}

/**
 * @param null|int min
 * @param null|int max
 * @param int      precision
 * @param int      scale
 */
function applyNumericOptions(min = null, max = null, precision = 10, scale = 2) {
  if (null !== max) {
    privateProps.get(this).max = parseInt(max);
  }

  if (null !== min) {
    privateProps.get(this).min = parseInt(min);
    if (null !== privateProps.get(this).max) {
      if (privateProps.get(this).min > privateProps.get(this).max) {
        privateProps.get(this).min = privateProps.get(this).max;
      }
    }
  }

  privateProps.get(this).precision = NumberUtils.bound(parseInt(precision), 1, 65);
  privateProps.get(this).scale = NumberUtils.bound(parseInt(scale), 0, privateProps.get(this).precision)
}

/**
 * @param mixed defaultValue
 *
 * @throws AssertionFailed
 * @throws \Exception
 */
function applyDefault(defaultValue = null) {
  privateProps.get(this).defaultValue = defaultValue;

  if (privateProps.get(this).type.isScalar()) {
    if (privateProps.get(this).type.getTypeName() !== TypeName.TIMESTAMP) {
      privateProps.get(this).useTypeDefault = true;
    }
  } else {
    let decodeDefault = null !== privateProps.get(this).defaultValue && 'function' !== typeof privateProps.get(this).defaultValue;

    switch (privateProps.get(this).type.getTypeName()) {
      case TypeName.IDENTIFIER:
        if (null === privateProps.get(this).instance) {
          throw new Error('Field [' + privateProps.get(this).name + '] requires an instance.');
        }

        if (decodeDefault && !privateProps.get(this).defaultValue.hasTrait('Identifier')) {
          privateProps.get(this).defaultValue = privateProps.get(this).type.decode(privateProps.get(this).defaultValue, this);
        }
        break;

      case TypeName.INT_ENUM:
      case TypeName.STRING_ENUM:
        if (null === privateProps.get(this).instance) {
          throw new Error('Field [' + privateProps.get(this).name + '] requires an instance.');
        }

        if (decodeDefault && !privateProps.get(this).defaultValue.hasTrait('Enum')) {
          privateProps.get(this).defaultValue = privateProps.get(this).type.decode(privateProps.get(this).defaultValue, this);
        }
        break;

      default:
        break;
    }
  }

  if (null !== privateProps.get(this).defaultValue && 'function' !== typeof privateProps.get(this).defaultValue) {
    guardDefault.bind(this)(privateProps.get(this).defaultValue);
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
    throw new Error('Field [' + privateProps.get(this).name + '] default must be an array.');
  }

  if (null === defaultValue) {
    return;
  }

  if (this.isAMap()) {
    if (!ArrayUtils.isAssoc(defaultValue)) {
      throw new Error('Field [' + privateProps.get(this).name + '] default must be an associative array.');
    }
  }

  ArrayUtils.each(defaultValue, function(value, key) {
    if (null === value) {
      throw new Error('Field [' + privateProps.get(this).name + '] default for key [' + value + '] cannot be null.');
    }

    this.guardValue(value);
  }.bind(this));
}
