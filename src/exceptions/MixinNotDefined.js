import SchemaException from './SchemaException';

export default class MixinNotDefined extends SchemaException {
  /**
   * @param {Schema} schema
   * @param {string} mixinId
   */
  constructor(schema, mixinId) {
    super(`Mixin [${mixinId}] is not defined on message [${schema.getId()}].`);
    this.schema = schema;
    this.mixinId = mixinId;
  }

  /**
   * @returns {string}
   */
  getMixinId() {
    return this.mixinId;
  }
}
