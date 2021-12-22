import LogicException from './LogicException.js';

export default class NoMessageForSchemaId extends LogicException {
  /**
   * @param {SchemaId} schemaId
   */
  constructor(schemaId) {
    super(`MessageResolver is unable to resolve schema id [${schemaId}] to a class.`);
    this.schemaId = schemaId;
  }

  /**
   * @returns {SchemaId}
   */
  getSchemaId() {
    return this.schemaId;
  }
}
