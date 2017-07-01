import LogicException from './LogicException';

export default class NoMessageForCurie extends LogicException {
  /**
   * @param {SchemaCurie} curie
   */
  constructor(curie) {
    super(`MessageResolver is unable to resolve schema curie [${curie}] to a class.`);
    this.curie = curie;
  }

  /**
   * @returns {SchemaCurie}
   */
  getCurie() {
    return this.curie;
  }
}