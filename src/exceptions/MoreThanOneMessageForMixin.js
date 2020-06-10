import LogicException from './LogicException';

export default class MoreThanOneMessageForMixin extends LogicException {
  /**
   * @param {string} mixin
   * @param {string[]} curies
   */
  constructor(mixin, curies) {
    super(`MessageResolver returned multiple curies using [${mixin}] when one was expected.  Curies found:\n  - ${curies}`);
    this.mixin = mixin;
    this.curies = curies;
  }

  /**
   * @returns {string}
   */
  getMixin() {
    return this.mixin;
  }

  /**
   * @returns {string[]}
   */
  getCuries() {
    return this.curies;
  }
}
