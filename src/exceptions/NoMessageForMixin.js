import LogicException from './LogicException';

export default class NoMessageForMixin extends LogicException {
  /**
   * @param {string} mixin
   */
  constructor(mixin) {
    super(`MessageResolver is unable to find any messages using [${mixin}].`);
    this.mixin = mixin;
  }

  /**
   * @returns {string}
   */
  getMixin() {
    return this.mixin;
  }
}
