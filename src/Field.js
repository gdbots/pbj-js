export default class Field {
  /**
   * @param {string} name
   * @param {Type} type
   */
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  /**
   * @return {string}
   */
  getName() {
    return this.name;
  }

  /**
   * @return {Type}
   */
  getType() {
    return this.type;
  }
}
