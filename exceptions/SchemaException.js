import LogicException from './LogicException';

export default class SchemaException extends LogicException {
  /**
   * @returns {Schema}
   */
  getSchema() {
    return this.schema;
  }
}