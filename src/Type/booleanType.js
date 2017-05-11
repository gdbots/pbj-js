import AbstractType from './AbstractType';
import TypeName from '../Enum/TypeName';

class BooleanType extends AbstractType {
  constructor() {
    super(TypeName.BOOLEAN);
  }

  /**
   * @param {*} value
   * @param {Field} field
   */
  guard(value, field) {
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @return {boolean}
   */
  encode(value, field, codec = null) {
    return value;
  }

  /**
   * @param {*} value
   * @param {Field} field
   * @param {Codec} [codec]
   *
   * @return {boolean}
   */
  decode(value, field, codec = null) {
    return value;
  }

  /**
   * @return {boolean}
   */
  getDefault() {
    return false;
  }

  /**
   * @return {boolean}
   */
  isBoolean() {
    return true;
  }

  /**
   * @return {boolean}
   */
  allowedInSet() {
    return false;
  }
}

const booleanType = new BooleanType();
Object.freeze(booleanType);

export default booleanType;
