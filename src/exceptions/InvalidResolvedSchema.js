import SchemaException from './SchemaException.js';

export default class InvalidResolvedSchema extends SchemaException {
  /**
   * @param {Schema}   schema
   * @param {SchemaId} resolvedSchemaId
   */
  constructor(schema, resolvedSchemaId) {
    super(`Schema id [${resolvedSchemaId}] was resolved to [${schema.getCurieMajor()}].  Curie majors must match.`);
    this.schema = schema;
    this.resolvedSchemaId = resolvedSchemaId;
  }

  /**
   * @returns {SchemaId}
   */
  getResolvedSchemaId() {
    return this.resolvedSchemaId;
  }
}
