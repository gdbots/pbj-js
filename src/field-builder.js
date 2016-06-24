'use strict';

import FieldRule from 'gdbots/pbj/enum/field-rule';
import Field from 'gdbots/pbj/field';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class FieldBuilder
{
  /**
   * @param string name
   * @param Type   type
   */
  constructor(name, type) {
    privateProps.set(this, {
      /** @var string */
      name: name,

      /** @var Type */
      type: type,

      /** @var FieldRule */
      rule: null,

      /** @var bool */
      required: false,

      /** @var int */
      minLength: null,

      /** @var int */
      maxLength: null,

      /** @var string */
      pattern: null,

      /** @var string */
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
      useTypeDefault: true,

      /** @var string */
      className: null,

      /** @var array */
      anyOfClassNames: null,

      /** @var \Closure */
      assertion: null,

      /** @var bool */
      overridable: false
    });
  }

  /**
   * @param string name
   * @param Type   type
   *
   * @return self
   */
  static create(name, type) {
    return new this(name, type);
  }

  /**
   * @return self
   */
  required() {
    privateProps.get(this).required = true;
    return this;
  }

  /**
   * @return self
   */
  optional() {
    privateProps.get(this).required = false;
    return this;
  }

  /**
   * @return self
   */
  asASingleValue() {
    privateProps.get(this).rule = FieldRule.A_SINGLE_VALUE;
    return this;
  }

  /**
   * @return self
   */
  asASet() {
    privateProps.get(this).rule = FieldRule.A_SET;
    return this;
  }

  /**
   * @return self
   */
  asAList() {
    privateProps.get(this).rule = FieldRule.A_LIST;
    return this;
  }

  /**
   * @return self
   */
  asAMap() {
    privateProps.get(this).rule = FieldRule.A_MAP;
    return this;
  }

  /**
   * @param int minLength
   *
   * @return self
   */
  minLength(minLength) {
    privateProps.get(this).minLength = parseInt(minLength);
    return this;
  }

  /**
   * @param int maxLength
   *
   * @return self
   */
  maxLength(maxLength) {
    privateProps.get(this).maxLength = parseInt(maxLength);
    return this;
  }

  /**
   * @param string pattern
   *
   * @return self
   */
  pattern(pattern) {
    privateProps.get(this).pattern = pattern;
    return this;
  }

  /**
   * @param string format
   *
   * @return self
   */
  format(format) {
    privateProps.get(this).format = format;
    return this;
  }

  /**
   * @param int min
   *
   * @return self
   */
  min(min) {
    privateProps.get(this).min = parseInt(min);
    return this;
  }

  /**
   * @param int max
   *
   * @return self
   */
  max(max) {
    privateProps.get(this).max = parseInt(max);
    return this;
  }

  /**
   * @param int precision
   *
   * @return self
   */
  precision(precision) {
    privateProps.get(this).precision = parseInt(precision);
    return this;
  }

  /**
   * @param int scale
   *
   * @return self
   */
  scale(scale) {
    privateProps.get(this).scale = parseInt(scale);
    return this;
  }

  /**
   * @param mixed defaultValue
   *
   * @return self
   */
  withDefault(defaultValue) {
    privateProps.get(this).defaultValue = defaultValue;
    return this;
  }

  /**
   * @param bool useTypeDefault
   *
   * @return self
   */
  useTypeDefault(useTypeDefault) {
    privateProps.get(this).useTypeDefault = Boolean(useTypeDefault);
    return this;
  }

  /**
   * @param string className
   *
   * @return self
   */
  className(className) {
    privateProps.get(this).className = className;
    privateProps.get(this).anyOfClassNames = null;
    return this;
  }

  /**
   * @param array anyOfClassNames
   *
   * @return self
   */
  anyOfClassNames(anyOfClassNames) {
    privateProps.get(this).anyOfClassNames = anyOfClassNames;
    privateProps.get(this).className = null;
    return this;
  }

  /**
   * @param \Closure assertion
   *
   * @return self
   */
  assertion(assertion) {
    privateProps.get(this).assertion = assertion;
    return this;
  }

  /**
   * @param bool overridable
   *
   * @return self
   */
  overridable(overridable) {
    privateProps.get(this).overridable = Boolean(overridable);
    return this;
  }

  /**
   * @return Field
   */
  build() {
    if (null === privateProps.get(this).rule) {
      privateProps.get(this).rule = FieldRule.A_SINGLE_VALUE;
    }

    return new Field(
      privateProps.get(this).name,
      privateProps.get(this).type,
      privateProps.get(this).rule,
      privateProps.get(this).required,
      privateProps.get(this).minLength,
      privateProps.get(this).maxLength,
      privateProps.get(this).pattern,
      privateProps.get(this).format,
      privateProps.get(this).min,
      privateProps.get(this).max,
      privateProps.get(this).precision,
      privateProps.get(this).scale,
      privateProps.get(this).defaultValue,
      privateProps.get(this).useTypeDefault,
      privateProps.get(this).className,
      privateProps.get(this).anyOfClassNames,
      privateProps.get(this).assertion,
      privateProps.get(this).overridable
    );
  }
}
