import SchemaException from './SchemaException';

export default class FieldOverrideNotCompatible extends SchemaException {
  /**
   * @param {Schema} schema
   * @param {string} fieldName
   * @param {Field}  overrideField
   */
  constructor(schema, fieldName, overrideField) {
    super(`Field [${fieldName}] override for [${schema.getId()}] is not compatible. Name, Type, Rule and Required must match.`);
    this.schema = schema;
    this.existingField = this.schema.getField(fieldName);
    this.overrideField = overrideField;
  }

  /**
   * @returns {Field}
   */
  getExistingField() {
    return this.existingField;
  }

  /**
   * @returns {string}
   */
  getFieldName() {
    return this.existingField.getName();
  }

  /**
   * @returns {Field}
   */
  getOverrideField() {
    return this.overrideField;
  }
}
