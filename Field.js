export default class Field {
  /**
   * @param {string} name
   * @param {Type}   type
   * @param {number} precision
   * @param {number} scale
   */
  constructor({ name, type, precision = 10, scale = 2 }) {
    this.name = name;
    this.type = type;
    this.min = null;
    this.max = null;
    this.precision = precision;
    this.scale = scale;
    Object.freeze(this);
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
   * @returns {?number}
   */
  getMin() {
    return this.min === null ? this.type.getMin() : this.min;
  }

  /**
   * @returns {?number}
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
}