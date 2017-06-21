import LogicException from './LogicException';

export default class NoSchemaForSchemaId extends LogicException {
  /**
   * @param {SchemaId} schemaId
   */
  constructor(schemaId) {
    super(`SchemaResolver is unable to resolve schema id [${schemaId}] to a class.`);
    this.schemaId = schemaId;
  }

  /**
   * @returns {SchemaId}
   */
  getSchemaId() {
    return this.schemaId;
  }
}
