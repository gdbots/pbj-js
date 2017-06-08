import toInteger from 'lodash-es/toInteger';
import FieldRule from './Enum/FieldRule';
import Field from './Field';

export default class FieldBuilder {
  /**
   * @param {string} name
   * @param {Type} type
   */
  constructor(name, type) {
    this.config = {
      name,
      type,
      rule: FieldRule.A_SINGLE_VALUE,
      required: false,
      precision: 10,
      scale: 2,
      useTypeDefault: true,
      overridable: false
    };
  }

  /**
   * @param {string} name
   * @param {Type} type
   *
   * @returns {FieldBuilder}
   */
  static create(name, type) {
    return new FieldBuilder(name, type);
  }

  /**
   * @returns {FieldBuilder}
   */
  required() {
    this.config.required = true;
    return this;
  }

  /**
   * @returns {FieldBuilder}
   */
  optional() {
    this.config.required = false;
    return this;
  }

  /**
   * @returns {FieldBuilder}
   */
  asASingleValue() {
    this.config.rule = FieldRule.A_SINGLE_VALUE;
    return this;
  }

  /**
   * @returns {FieldBuilder}
   */
  asASet() {
    this.config.rule = FieldRule.A_SET;
    return this;
  }

  /**
   * @returns {FieldBuilder}
   */
  asAList() {
    this.config.rule = FieldRule.A_LIST;
    return this;
  }

  /**
   * @returns {FieldBuilder}
   */
  asAMap() {
    this.config.rule = FieldRule.A_MAP;
    return this;
  }

  /**
   * @param {number} minLength
   *
   * @returns {FieldBuilder}
   */
  minLength(minLength) {
    this.config.minLength = toInteger(minLength);
    return this;
  }

  /**
   * @param {number} maxLength
   *
   * @returns {FieldBuilder}
   */
  maxLength(maxLength) {
    this.config.maxLength = toInteger(maxLength);
    return this;
  }

  /**
   * @param {string} pattern
   *
   * @returns {FieldBuilder}
   */
  pattern(pattern) {
    this.config.pattern = pattern;
    return this;
  }

  /**
   * @param {string} format
   *
   * @returns {FieldBuilder}
   */
  format(format) {
    this.config.format = format;
    return this;
  }

  /**
   * @param {number} min
   *
   * @returns {FieldBuilder}
   */
  min(min) {
    this.config.min = toInteger(min);
    return this;
  }

  /**
   * @param {number} max
   *
   * @returns {FieldBuilder}
   */
  max(max) {
    this.config.max = toInteger(max);
    return this;
  }

  /**
   * @param {number} precision
   *
   * @returns {FieldBuilder}
   */
  precision(precision) {
    this.config.precision = toInteger(precision);
    return this;
  }

  /**
   * @param {number} scale
   *
   * @returns {FieldBuilder}
   */
  scale(scale) {
    this.config.scale = toInteger(scale);
    return this;
  }

  /**
   * @param {*} defaultValue
   *
   * @returns {FieldBuilder}
   */
  withDefault(defaultValue) {
    this.config.defaultValue = defaultValue;
    return this;
  }

  /**
   * @param {boolean} useTypeDefault
   *
   * @returns {FieldBuilder}
   */
  useTypeDefault(useTypeDefault) {
    this.config.useTypeDefault = useTypeDefault;
    return this;
  }

  /**
   * @param {Function} classProto
   *
   * @returns {FieldBuilder}
   */
  classProto(classProto) {
    this.config.classProto = classProto;
    return this;
  }

  /**
   * @param {string[]} anyOfCuries
   *
   * @returns {FieldBuilder}
   */
  anyOfCuries(anyOfCuries) {
    this.config.anyOfCuries = anyOfCuries;
    return this;
  }

  /**
   * @param {Function} assertion
   *
   * @returns {FieldBuilder}
   */
  assertion(assertion) {
    this.config.assertion = assertion;
    return this;
  }

  /**
   * @param {boolean} overridable
   *
   * @returns {FieldBuilder}
   */
  overridable(overridable) {
    this.config.overridable = overridable;
    return this;
  }

  /**
   * @returns {Field}
   */
  build() {
    return new Field(Object.assign({}, this.config));
  }
}