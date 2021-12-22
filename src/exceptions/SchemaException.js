import LogicException from './LogicException.js';

export default class SchemaException extends LogicException {
  /**
   * @returns {Schema}
   */
  getSchema() {
    return this.schema;
  }
}
