import LogicException from './LogicException';

export default class NoMessageForMixin extends LogicException {
  /**
   * @param {Mixin} mixin
   */
  constructor(mixin) {
    super(`MessageResolver is unable to find any messages using [${mixin.getId().getCurieMajor()}].`);
    this.mixin = mixin;
  }

  /**
   * @returns {Mixin}
   */
  getMixin() {
    return this.mixin;
  }
}