export default class Field {
  /**
   * @param {string} name
   * @param {Type} type
   */
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.min = null;
    this.max = null;
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
}
