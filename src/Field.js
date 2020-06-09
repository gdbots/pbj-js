/* eslint-disable indent */
import Enum from './Enum';
import clamp from 'lodash/clamp';
import intersection from 'lodash/intersection';
import isArray from 'lodash/isArray';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isMap from 'lodash/isMap';
import isPlainObject from 'lodash/isPlainObject';
import isSet from 'lodash/isSet';
import toInteger from 'lodash/toInteger';
import trim from 'lodash/trim';
import AssertionFailed from './exceptions/AssertionFailed';
import FieldRule from './enums/FieldRule';
import Format from './enums/Format';
import Identifier from './well-known/Identifier';
import TypeName from './enums/TypeName';

/**
 * Regular expression pattern for matching a valid field name.
 * @type {RegExp}
 */
export const VALID_NAME_PATTERN = /^[a-zA-Z_]{1}[a-zA-Z0-9_]{0,126}$/;

export default class Field {
  /**
   * todo: resolve jsdoc with destructuring
   */
  constructor({
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
                classProto = null,
                anyOfCuries = [],
                assertion = null,
                overridable = false,
              }) {
    this.name = name;
    this.type = type;
    this.required = isBoolean(required) ? required : false;
    this.useTypeDefault = isBoolean(useTypeDefault) ? useTypeDefault : true;
    this.classProto = classProto;
    this.anyOfCuries = isArray(anyOfCuries) ? anyOfCuries : [];
    this.assertion = isFunction(assertion) ? assertion : null;
    this.overridable = isBoolean(overridable) ? overridable : false;

    if (!VALID_NAME_PATTERN.test(this.name)) {
      throw new AssertionFailed(`Field [${this.name}] must match pattern [${VALID_NAME_PATTERN}].`);
    }

    this.applyFieldRule(rule);
    this.applyStringOptions(minLength, maxLength, pattern, format);
    this.applyNumericOptions(min, max, precision, scale);
    this.applyDefault(defaultValue);
    Object.freeze(this);
  }

  /**
   * @private
   *
   * @param {FieldRule} rule
   */
  applyFieldRule(rule = null) {
    this.rule = rule || FieldRule.A_SINGLE_VALUE;
    if (this.isASet() && !this.type.allowedInSet()) {
      throw new AssertionFailed(`Field [${this.name}] with type [${this.type.getTypeValue()}] cannot be used in a set.`);
    }
  }

  /**
   * @private
   *
   * @param {?number} minLength
   * @param {?number} maxLength
   * @param {?string} pattern
   * @param {?Format} format
   */
  applyStringOptions(minLength = null, maxLength = null, pattern = null, format = null) {
    this.minLength = toInteger(minLength);
    this.maxLength = toInteger(maxLength);

    if (this.maxLength > 0) {
      this.minLength = clamp(this.minLength, 0, this.maxLength);
    } else {
      this.minLength = clamp(this.minLength, 0, this.type.getMaxBytes());
    }

    this.pattern = pattern ? new RegExp(trim(pattern, '/')) : null;

    if (format) {
      try {
        this.format = Format.create(`${format}`);
      } catch (e) {
        this.format = Format.UNKNOWN;
      }
    } else {
      this.format = Format.UNKNOWN;
    }
  }

  /**
   * @private
   *
   * @param {?number} min
   * @param {?number} max
   * @param {?number} precision
   * @param {?number} scale
   */
  applyNumericOptions(min = null, max = null, precision = 10, scale = 2) {
    this.min = min;
    this.max = max;

    if (this.max !== null) {
      this.max = toInteger(this.max);
    }

    if (this.min !== null) {
      this.min = toInteger(this.min);
      if (this.max !== null && this.min > this.max) {
        this.min = this.max;
      }
    }

    this.precision = clamp(precision, 1, 65);
    this.scale = clamp(scale, 0, this.precision);
  }

  /**
   * @private
   *
   * @param {*} defaultValue
   */
  applyDefault(defaultValue = null) {
    this.defaultValue = defaultValue;
    const defaultValueIsAFunction = isFunction(this.defaultValue);

    if (this.type.isScalar()) {
      if (this.type.getTypeName() !== TypeName.TIMESTAMP) {
        this.useTypeDefault = true;
      }
    } else {
      const decodeDefault = this.defaultValue !== null && !defaultValueIsAFunction;
      switch (this.type.getTypeValue()) {
        case TypeName.IDENTIFIER.getValue():
          if (!this.hasClassProto()) {
            throw new AssertionFailed(`Field [${this.name}] requires a classProto.`);
          }

          if (decodeDefault && !(this.defaultValue instanceof Identifier)) {
            this.defaultValue = this.type.decode(this.defaultValue, this);
          }

          break;

        case TypeName.INT_ENUM.getValue():
        case TypeName.STRING_ENUM.getValue():
          if (!this.hasClassProto()) {
            throw new AssertionFailed(`Field [${this.name}] requires a classProto.`);
          }

          if (decodeDefault && !(this.defaultValue instanceof Enum)) {
            this.defaultValue = this.type.decode(this.defaultValue, this);
          }

          break;

        default:
          break;
      }
    }

    if (this.defaultValue !== null && !defaultValueIsAFunction) {
      this.guardDefault(this.defaultValue);
    }
  }

  /**
   * @returns {string}
   */
  getName() {
    return this.name;
  }

  /**
   * @returns {Type}
   */
  getType() {
    return this.type;
  }

  /**
   * @returns FieldRule
   */
  getRule() {
    return this.rule;
  }

  /**
   * @returns {boolean}
   */
  isASingleValue() {
    return FieldRule.A_SINGLE_VALUE === this.rule;
  }

  /**
   * @returns {boolean}
   */
  isASet() {
    return FieldRule.A_SET === this.rule;
  }

  /**
   * @returns {boolean}
   */
  isAList() {
    return FieldRule.A_LIST === this.rule;
  }

  /**
   * @returns {boolean}
   */
  isAMap() {
    return FieldRule.A_MAP === this.rule;
  }

  /**
   * @returns {boolean}
   */
  isRequired() {
    return this.required;
  }

  /**
   * @returns {number}
   */
  getMinLength() {
    return this.minLength;
  }

  /**
   * @returns {number}
   */
  getMaxLength() {
    return this.maxLength > 0 ? this.maxLength : this.type.getMaxBytes();
  }

  /**
   * @returns {?RegExp}
   */
  getPattern() {
    return this.pattern;
  }

  /**
   * @returns {Format}
   */
  getFormat() {
    return this.format;
  }

  /**
   * @returns {number}
   */
  getMin() {
    return this.min === null ? this.type.getMin() : this.min;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return this.max === null ? this.type.getMax() : this.max;
  }

  /**
   * @returns {number}
   */
  getPrecision() {
    return this.precision;
  }

  /**
   * @returns {number}
   */
  getScale() {
    return this.scale;
  }

  /**
   * @param {?Message} message
   */
  getDefault(message = null) {
    if (this.defaultValue === null) {
      if (this.useTypeDefault) {
        return this.isASingleValue() ? this.type.getDefault() : [];
      }

      return this.isASingleValue() ? null : [];
    }

    if (!isFunction(this.defaultValue)) {
      return this.defaultValue;
    }

    const dynamicDefault = this.defaultValue(message, this);
    this.guardDefault(dynamicDefault);
    if (dynamicDefault === null) {
      if (this.useTypeDefault) {
        return this.isASingleValue() ? this.type.getDefault() : [];
      }

      return this.isASingleValue() ? null : [];
    }

    return dynamicDefault;
  }

  /**
   * @private
   *
   * @param {*} defaultValue
   *
   * @throws {AssertionFailed}
   */
  guardDefault(defaultValue) {
    if (defaultValue === null) {
      return;
    }

    if (this.isASingleValue()) {
      this.guardValue(defaultValue);
      return;
    }

    if (this.isAMap() && !isMap(defaultValue)) {
      throw new AssertionFailed(`Field [${this.name}] default must be a Map.`);
    } else if (this.isASet() && !isSet(defaultValue)) {
      throw new AssertionFailed(`Field [${this.name}] default must be a Set.`);
    } else if (this.isAList() && !isArray(defaultValue)) {
      throw new AssertionFailed(`Field [${this.name}] default must be an Array.`);
    }

    defaultValue.forEach((v, k) => {
      if (v === null) {
        throw new AssertionFailed(`Field [${this.name}] default for key [${k}] cannot be null.`);
      }

      this.guardValue(v);
    });
  }

  /**
   * @returns {boolean}
   */
  hasClassProto() {
    return this.classProto !== null && isObject(this.classProto) && !isPlainObject(this.classProto);
  }

  /**
   * @returns {?Enum|Object|Message|Identifier}
   */
  getClassProto() {
    return this.classProto;
  }

  /**
   * @returns {string[]}
   */
  getAnyOfCuries() {
    return this.anyOfCuries;
  }

  /**
   * @returns {boolean}
   */
  isOverridable() {
    return this.overridable;
  }

  /**
   * @param {*} value
   *
   * @throws {AssertionFailed}
   */
  guardValue(value) {
    if (this.required && value === null) {
      throw new AssertionFailed(`Field [${this.name}] is required and cannot be null.`);
    }

    if (value !== null) {
      this.type.guard(value, this);
    }

    if (this.assertion) {
      this.assertion(value, this);
    }
  }

  /**
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this);
  }

  /**
   * @returns {Object}
   */
  toObject() {
    return {
      name: this.name,
      type: this.type.getTypeValue(),
      rule: this.rule.getName(),
      required: this.required,
      min_length: this.minLength,
      max_length: this.maxLength,
      pattern: `${this.pattern}`,
      format: this.format.getValue(),
      min: this.min,
      max: this.max,
      precision: this.precision,
      scale: this.scale,
      default_value: this.defaultValue,
      use_type_default: this.useTypeDefault,
      class_proto: this.classProto,
      any_of_curies: this.anyOfCuries,
      has_assertion: this.assertion !== null,
      overridable: this.overridable,
    };
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * @returns {string}
   */
  valueOf() {
    return this.toString();
  }

  /**
   * Returns true if this field is likely compatible with the
   * provided field during a mergeFrom operation.
   *
   * todo: implement/test isCompatibleForMerge
   *
   * @param {Field} other
   *
   * @returns {boolean}
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

    return intersection(this.anyOfCuries, other.anyOfCuries).length;
  }

  /**
   * Returns true if the provided field can be used as an
   * override to this field.
   *
   * @param {Field} other
   *
   * @returns {boolean}
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

    return this.required === other.required;
  }
}
