import truncate from 'lodash-es/truncate.js';
import InvalidArgumentException from './InvalidArgumentException.js';

export default class EncodeValueFailed extends InvalidArgumentException {
  /**
   * @param {*} value
   * @param {Field} field
   * @param {string} message
   */
  constructor(value, field, message) {
    super(`Failed to encode [${truncate(value)}] for field [${field.getName()}].  ${message}`);
    this.value = value;
    this.field = field;
  }

  /**
   * @returns {*}
   */
  getValue() {
    return this.value;
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
