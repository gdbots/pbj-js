import LogicException from './LogicException';

export default class FrozenMessageIsImmutable extends LogicException {
  /**
   * @param {Message} pbj
   */
  constructor(pbj) {
    super('Message is frozen and cannot be modified.');
    this.pbj = pbj;
  }

  /**
   * @returns {Message}
   */
  getPbj() {
    return this.pbj;
  }
}