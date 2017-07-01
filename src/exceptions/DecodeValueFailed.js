import truncate from 'lodash/truncate';
import InvalidArgumentException from './InvalidArgumentException';

export default class DecodeValueFailed extends InvalidArgumentException {
  /**
   * @param {*} value
   * @param {Field} field
   * @param {string} message
   */
  constructor(value, field, message) {
    super(`Failed to decode [${truncate(value)}] for field [${field.getName()}] to a [${field.getType().getTypeName()}].  ${message}`);
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
