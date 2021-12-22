import SchemaException from './SchemaException.js';

export default class FieldNotDefined extends SchemaException {
  /**
   * @param {Schema} schema
   * @param {string} fieldName
   */
  constructor(schema, fieldName) {
    super(`Field [${fieldName}] is not defined on message [${schema.getId()}].`);
    this.schema = schema;
    this.fieldName = fieldName;
  }

  /**
   * @returns {string}
   */
  getFieldName() {
    return this.fieldName;
  }
}
