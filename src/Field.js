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
    if (this.min === null) {
      return this.type.getMin();
    }
    return this.min;
  }

  /**
   * @returns {?number}
   */
  getMax() {
    if (this.max === null) {
      return this.type.getMax();
    }
    return this.max;
  }
}
