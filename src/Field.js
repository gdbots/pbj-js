/* eslint-disable class-methods-use-this, no-unused-vars */

import clamp from 'lodash/clamp';
import isBoolean from 'lodash/isBoolean';
import isObject from 'lodash/isObject';
import isPlainObject from 'lodash/isPlainObject';
import toInteger from 'lodash/toInteger';
import trim from 'lodash/trim';
import FieldRule from './Enum/FieldRule';
import Format from './Enum/Format';
import Message from './Message';
import Type from './Type/Type';

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
                curie = null,
                anyOfCuries = null,
                assertion = null,
                overridable = false,
              }) {
    this.name = name;
    this.type = type;
    this.rule = rule;
    this.required = isBoolean(required) ? required : false;
    this.min = min;
    this.max = max;
    this.precision = precision;
    this.scale = scale;
    this.defaultValue = defaultValue;
    this.useTypeDefault = isBoolean(useTypeDefault) ? useTypeDefault : true;
    this.classProto = classProto;
    this.curie = curie;
    this.anyOfCuries = anyOfCuries;
    this.assertion = assertion || (() => {});
    this.overridable = isBoolean(overridable) ? overridable : false;

    this.applyStringOptions(minLength, maxLength, pattern, format);
    Object.freeze(this);
  }

  /**
   * @private
   *
   * @param {FieldRule} rule
   */
  applyFieldRule(rule = null) {
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
  }

  /**
   * @private
   *
   * @param {*} defaultValue
   */
  applyDefault(defaultValue = null) {
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
   * @returns {?string}
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
  }

  /**
   * @param {*} defaultValue
   */
  guardDefault(defaultValue) {
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
   * @returns {boolean}
   */
  hasCurie() {
    return this.curie && this.curie.length;
  }

  /**
   * @returns {?string}
   */
  getCurie() {
    return this.curie;
  }

  /**
   * @returns {boolean}
   */
  hasAnyOfCuries() {
    return this.anyOfCuries && this.anyOfCuries.length;
  }

  /**
   * @returns {string[]}
   */
  getAnyOfCuries() {
    return this.anyOfCuries || [];
  }

  /**
   * @returns {boolean}
   */
  isOverridable() {
    return this.overridable;
  }

  /**
   * @param {*} value
   * @throws AssertionFailed
   * @throws \Exception
   */
  guardValue(value) {
    if (this.required) {
      // Assertion::notNull($value,
      // sprintf('Field [%s] is required and cannot be null.', this.name));
    }

    if (value !== null) {
      this.type.guard(value, this);
    }

    if (this.assertion) {
      this.assertion(value, this);
    }
  }

  /**
   * {@inheritdoc}
   */
  toArray() {
    // return [
    //     'name'          => this.name,
    //     'type'          => this.type->getTypeValue(),
    //     'rule'          => this.rule->getName(),
    //     'required'      => this.required,
    //     'min_length'    => this.minLength,
    //     'max_length'    => this.maxLength,
    //     'pattern'       => this.pattern,
    //     'format'        => this.format->getValue(),
    //     'min'           => this.min,
    //     'max'           => this.max,
    //     'precision'     => this.precision,
    //     'scale'         => this.scale,
    //     'default'       => this.getDefault(),
    //     'use_type_default' => this.useTypeDefault,
    //     'class_name'    => this.className,
    //     'any_of_class_names' => this.anyOfClassNames,
    //     'has_assertion' => null !== this.assertion,
    //     'overridable'   => this.overridable,
    // ];
  }

  /**
   * Returns true if this field is likely compatible with the
   * provided field during a mergeFrom operation.
   *
   * todo: implement/test isCompatibleForMerge
   *
   * @param {Field} other
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

    if (this.curie !== other.curie) {
      return false;
    }

    // if (!array_intersect(this.anyOfClassNames, other.anyOfClassNames)) {
    //     return false;
    // }

    return true;
  }

  /**
   * Returns true if the provided field can be used as an
   * override to this field.
   *
   * @param {Field} other
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
