'use strict';

import StringUtils from 'gdbots/common/util/string-utils';
import TypeName from 'gdbots/pbj/enum/type-name';

/** @var array */
let _instances = {};

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class Type
{
  /**
   * Private constructor to ensure flyweight construction.
   *
   * @param TypeName typeName
   */
  constructor(typeName) {
    privateProps.set(this, {
      /** @var TypeName */
      typeName: typeName
    });
  }

  /**
   * @return Type
   */
  static create() {
    let type = this.name;
    if (undefined === _instances[type]) {
      _instances[type] = new this(TypeName[StringUtils.toSnakeCase(type.replace('Type', '')).toUpperCase()]);
    }

    return _instances[type];
  }

  /**
   * @return TypeName
   */
  getTypeName() {
    return privateProps.get(this).typeName;
  }

  /**
   * Shortcut to returning the value of the TypeName
   *
   * @return string
   */
  getTypeValue() {
    return privateProps.get(this).typeName.value;
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @throws \Exception
   */
  guard(value, field) {}

  /**
   * @param mixed value
   * @param Field field
   *
   * @return mixed
   *
   * @throws GdbotsPbjException
   * @throws EncodeValueFailed
   */
  encode(value, field) {}

  /**
   * @param mixed value
   * @param Field field
   *
   * @return mixed
   *
   * @throws GdbotsPbjException
   * @throws DecodeValueFailed
   */
  decode(value, field) {}

  /**
   * Returns true if the value gets decoded and stored during runtime as a scalar value.
   *
   * @return bool
   */
  isScalar() {
    return true;
  }

  /**
   * Returns true if the value gets encoded to a scalar value. This is important to
   * know because a big int, date, enum, etc. is stored as an object on the message
   * but when the message is encoded to an array, json, etc. it's a scalar value.
   *
   * @return bool
   */
  encodesToScalar() {
    return true;
  }

  /**
   * @return mixed
   */
  getDefault() {
    return null;
  }

  /**
   * @return bool
   */
  isBoolean() {
    return false;
  }

  /**
   * @return bool
   */
  isBinary() {
    return false;
  }

  /**
   * @return bool
   */
  isNumeric() {
    return false;
  }

  /**
   * @return bool
   */
  isString() {
    return false;
  }

  /**
   * @return bool
   */
  isMessage() {
    return false;
  }

  /**
   * Returns the minimum value supported by an integer type.
   *
   * @return int
   */
  getMin() {
    return -2147483648;
  }

  /**
   * Returns the maximum value supported by an integer type.
   *
   * @return int
   */
  getMax() {
    return 2147483647;
  }

  /**
   * Returns the maximum number of bytes supported by the string or binary type.
   *
   * @return int
   */
  getMaxBytes() {
    return 65535;
  }

  /**
   * @return bool
   */
  allowedInSet() {
    return true;
  }
}
