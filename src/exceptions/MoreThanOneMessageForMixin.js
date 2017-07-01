import LogicException from './LogicException';

export default class MoreThanOneMessageForMixin extends LogicException {
  /**
   * @param {Mixin} mixin
   * @param {Schema[]} schemas
   */
  constructor(mixin, schemas) {
    const ids = schemas.map(s => s.getId().toString()).join('\n  - ');
    super(`MessageResolver returned multiple schemas using [${mixin.getId().getCurieMajor()}] when one was expected.  Schemas found:\n  - ${ids}`);
    this.mixin = mixin;
    this.schemas = schemas;
  }

  /**
   * @returns {Mixin}
   */
  getMixin() {
    return this.mixin;
  }

  /**
   * @returns {Schema[]}
   */
  getSchemas() {
    return this.schemas;
  }
}
