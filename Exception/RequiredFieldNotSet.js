import SchemaException from './SchemaException';

export default class RequiredFieldNotSet extends SchemaException {
  /**
   * @param {Message} pbj
   * @param {Field} field
   */
  constructor(pbj, field) {
    super(`Required field [${field.getName()}] must be set on [${pbj.schema().getCurieMajor()}].`);
    this.pbj = pbj;
    this.field = field;
  }

  /**
   * @returns {Message}
   */
  getPbj() {
    return this.pbj;
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