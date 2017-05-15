/* eslint-disable class-methods-use-this */

export default class Type {
  /**
   * @param {TypeName} typeName
   */
  constructor(typeName) {
    this.typeName = typeName;
  }

  /**
   * @return {TypeName}
   */
  getTypeName() {
    return this.typeName;
  }

  /**
   * @return {string}
   */
  getTypeValue() {
    return this.typeName.getValue();
  }

  /**
   * @return {boolean}
   */
  isScalar() {
    return true;
  }

  /**
   * @return {boolean}
   */
  encodesToScalar() {
    return true;
  }

  /**
   * @return {*}
   */
  getDefault() {
    return null;
  }

  /**
   * @return {boolean}
   */
  isBoolean() {
    return false;
  }

  /**
   * @return {boolean}
   */
  isBinary() {
    return false;
  }

  /**
   * @return {boolean}
   */
  isNumeric() {
    return false;
  }

  /**
   * @return {boolean}
   */
  isString() {
    return false;
  }

  /**
   * @return {boolean}
   */
  isMessage() {
    return false;
  }

  /**
   * @return {Integer}
   */
  getMin() {
    return -2147483648;
  }

  /**
   * @return {Integer}
   */
  getMax() {
    return 2147483647;
  }

  /**
   * @return {Integer}
   */
  getMaxBytes() {
    return 65535;
  }

  /**
   * @return {boolean}
   */
  allowedInSet() {
    return true;
  }
}