/* eslint-disable class-methods-use-this, no-unused-vars */

import isBoolean from 'lodash-es/isBoolean';
import FieldRule from './Enum/FieldRule';
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
    anyOfClassProtos = null,
    assertion = null,
    overridable = false
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
    this.anyOfClassProtos = anyOfClassProtos;
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
  applyFieldRule(rule = null) {}

  /**
   * @private
   *
   * @param {?number} minLength
   * @param {?number} maxLength
   * @param {?string} pattern
   * @param {?Format} format
   */
  applyStringOptions(minLength = null, maxLength = null, pattern = null, format = null) {
    this.minLength = 0; // minLength;
    this.maxLength = maxLength;
    this.pattern = pattern;
    this.format = format;
  }

  /**
   * @private
   *
   * @param {?number} min
   * @param {?number} max
   * @param {?number} precision
   * @param {?number} scale
   */
  applyNumericOptions(min = null, max = null, precision = 10, scale = 2) {}

  /**
   * @private
   *
   * @param {*} defaultValue
   */
  applyDefault(defaultValue = null) {}

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
    return this.maxLength === null ? this.type.getMaxBytes() : this.maxLength;
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
  getDefault(message = null) {}

  /**
   * @param {*} defaultValue
   */
  guardDefault(defaultValue) {}
}