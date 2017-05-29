import truncate from 'lodash-es/truncate';
import GdbotsPbjException from './GdbotsPbjException';

export default class DecodeValueFailed extends GdbotsPbjException {
  /**
   * @param {*} value
   * @param {Field} field
   * @param {string} message
   */
  constructor(value, field, message) {
    const m = `Failed to decode [${truncate(value)}] for field [${field.getName()}] to a [${field.getType().getTypeName()}].  ${message}`;
    // 3 = INVALID_ARGUMENT
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L12
    super(m, 3);
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