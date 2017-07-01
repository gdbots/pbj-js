import SchemaException from './SchemaException';

export default class FieldAlreadyDefined extends SchemaException {
  /**
   * @param {Schema} schema
   * @param {string} fieldName
   */
  constructor(schema, fieldName) {
    super(`Field [${fieldName}] is already defined on message [${schema.getId()}] and is not overridable.`);
    this.schema = schema;
    this.field = this.schema.getField(fieldName);
  }

  /**
   * @returns {Field}
   */
  getField() {
    return this.field;
  }

  /**
   * @returns {string}
   */
  getFieldName() {
    return this.field.getName();
  }
}