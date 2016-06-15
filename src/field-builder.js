'use strict';

import FieldRule from 'gdbots/pbj/enum/field-rule';
import Field from 'gdbots/pbj/field';

export default class FieldBuilder
{
  /**
   * @param string name
   * @param Type   type
   */
  constructor(name, type) {

    /** @var string */
    this.name = name;

    /** @var Type */
    this.type = type;

    /** @var FieldRule */
    this.rule = null;

    /** @var bool */
    this.required = false;

    /** @var int */
    this.minLength = null;

    /** @var int */
    this.maxLength = null;

    /** @var string */
    this.pattern = null;

    /** @var string */
    this.format = null;

    /** @var int */
    this.min = null;

    /** @var int */
    this.max = null;

    /** @var int */
    this.precision = 10;

    /** @var int */
    this.scale = 2;

    /** @var mixed */
    this.defaultValue = null;

    /** @var bool */
    this.useTypeDefault = true;

    /** @var string */
    this.className = null;

    /** @var array */
    this.anyOfClassNames = null;

    /** @var \Closure */
    this.assertion = null;

    /** @var bool */
    this.overridable = false;
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
  isRequired() {
    this.required = true;
    return this;
  }

  /**
   * @return self
   */
  isOptional() {
    this.required = false;
    return this;
  }

  /**
   * @return self
   */
  asASingleValue() {
    this.rule = FieldRule.A_SINGLE_VALUE;
    return this;
  }

  /**
   * @return self
   */
  asASet() {
    this.rule = FieldRule.A_SET;
    return this;
  }

  /**
   * @return self
   */
  asAList() {
    this.rule = FieldRule.A_LIST;
    return this;
  }

  /**
   * @return self
   */
  asAMap() {
    this.rule = FieldRule.A_MAP;
    return this;
  }

  /**
   * @param int minLength
   *
   * @return self
   */
  setMinLength(minLength) {
    this.minLength = parseInt(minLength);
    return this;
  }

  /**
   * @param int maxLength
   *
   * @return self
   */
  setMaxLength(maxLength) {
    this.maxLength = parseInt(maxLength);
    return this;
  }

  /**
   * @param string pattern
   *
   * @return self
   */
  setPattern(pattern) {
    this.pattern = pattern;
    return this;
  }

  /**
   * @param string format
   *
   * @return self
   */
  setFormat(format) {
    this.format = format;
    return this;
  }

  /**
   * @param int min
   *
   * @return self
   */
  setMin(min) {
    this.min = parseInt(min);
    return this;
  }

  /**
   * @param int max
   *
   * @return self
   */
  setMax(max) {
    this.max = parseInt(max);
    return this;
  }

  /**
   * @param int precision
   *
   * @return self
   */
  setPrecision(precision) {
    this.precision = parseInt(precision);
    return this;
  }

  /**
   * @param int scale
   *
   * @return self
   */
  setScale(scale) {
    this.scale = parseInt(scale);
    return this;
  }

  /**
   * @param mixed defaultValue
   *
   * @return self
   */
  setDefaultValue(defaultValue) {
    this.defaultValue = defaultValue;
    return this;
  }

  /**
   * @param bool useTypeDefault
   *
   * @return self
   */
  setUseTypeDefault(useTypeDefault) {
    this.useTypeDefault = Boolean(useTypeDefault);
    return this;
  }

  /**
   * @param string className
   *
   * @return self
   */
  setClassName(className) {
    this.className = className;
    this.anyOfClassNames = null;
    return this;
  }

  /**
   * @param array anyOfClassNames
   *
   * @return self
   */
  setAnyOfClassNames(anyOfClassNames) {
    this.anyOfClassNames = anyOfClassNames;
    this.className = null;
    return this;
  }

  /**
   * @param \Closure assertion
   *
   * @return self
   */
  setAssertion(assertion) {
    this.assertion = assertion;
    return this;
  }

  /**
   * @param bool overridable
   *
   * @return self
   */
  setOverridable(overridable) {
    this.overridable = Boolean(overridable);
    return this;
  }

  /**
   * @return Field
   */
  build() {
    if (null === this.rule) {
      this.rule = FieldRule.A_SINGLE_VALUE;
    }

    return new Field(
      this.name,
      this.type,
      this.rule,
      this.required,
      this.minLength,
      this.maxLength,
      this.pattern,
      this.format,
      this.min,
      this.max,
      this.precision,
      this.scale,
      this.defaultValue,
      this.useTypeDefault,
      this.className,
      this.anyOfClassNames,
      this.assertion,
      this.overridable
    );
  }
}
