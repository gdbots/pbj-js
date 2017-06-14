/* eslint-disable class-methods-use-this */

/**
 * We store all Type instances to accomplish a loose flyweight strategy.
 * Loose because we're not strictly enforcing it, but internally in this
 * library we only use the factory create method to create types.
 *
 * @type {Map}
 */
const instances = new Map();

export default class Type {
  /**
   * @param {TypeName} typeName
   */
  constructor(typeName) {
    this.typeName = typeName;
    Object.freeze(this);
  }

  /**
   * @returns {Type}
   */
  static create() {
    if (!instances.has(this)) {
      instances.set(this, new this());
    }

    return instances.get(this);
  }

  /**
   * @returns {TypeName}
   */
  getTypeName() {
    return this.typeName;
  }

  /**
   * @returns {string}
   */
  getTypeValue() {
    return this.typeName.getValue();
  }

  /**
   * @returns {boolean}
   */
  isScalar() {
    return true;
  }

  /**
   * @returns {boolean}
   */
  encodesToScalar() {
    return true;
  }

  /**
   * @returns {*}
   */
  getDefault() {
    return null;
  }

  /**
   * @returns {boolean}
   */
  isBoolean() {
    return false;
  }

  /**
   * @returns {boolean}
   */
  isBinary() {
    return false;
  }

  /**
   * @returns {boolean}
   */
  isNumeric() {
    return false;
  }

  /**
   * @returns {boolean}
   */
  isString() {
    return false;
  }

  /**
   * @returns {boolean}
   */
  isMessage() {
    return false;
  }

  /**
   * @returns {number}
   */
  getMin() {
    return -2147483648;
  }

  /**
   * @returns {number}
   */
  getMax() {
    return 2147483647;
  }

  /**
   * @returns {number}
   */
  getMaxBytes() {
    return 65535;
  }

  /**
   * @returns {boolean}
   */
  allowedInSet() {
    return true;
  }
}