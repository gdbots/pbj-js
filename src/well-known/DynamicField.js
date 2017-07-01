import isString from 'lodash/isString';
import DynamicFieldKind from '../enums/DynamicFieldKind';
import FieldRule from '../enums/FieldRule';
import AssertionFailed from '../exceptions/AssertionFailed';
import Field from '../Field';
import BooleanType from '../types/BooleanType';
import DateType from '../types/DateType';
import FloatType from '../types/FloatType';
import IntType from '../types/IntType';
import StringType from '../types/StringType';
import TextType from '../types/TextType';

/**
 * Dynamic fields need one field object per "kind".
 * Map provides the storage for the flyweight strategy.
 *
 * @type {Map}
 */
const fields = new Map();

/**
 * @param {string} kind
 *
 * @returns {Field}
 */
function createField(kind) {
  if (!fields.has(kind)) {
    let type;
    switch (kind) {
      case DynamicFieldKind.STRING_VAL.toString():
        type = StringType.create();
        break;

      case DynamicFieldKind.TEXT_VAL.toString():
        type = TextType.create();
        break;

      case DynamicFieldKind.INT_VAL.toString():
        type = IntType.create();
        break;

      case DynamicFieldKind.BOOL_VAL.toString():
        type = BooleanType.create();
        break;

      case DynamicFieldKind.FLOAT_VAL.toString():
        type = FloatType.create();
        break;

      case DynamicFieldKind.DATE_VAL.toString():
        type = DateType.create();
        break;

      default:
        throw new AssertionFailed(`DynamicField "${kind}" is not a valid type.`);
    }

    fields.set(
      kind, new Field({ name: kind, type, rule: FieldRule.A_SINGLE_VALUE, required: true }),
    );
  }

  return fields.get(kind);
}

/**
 * Regular expression pattern for matching a valid dynamic field name.
 * @type {RegExp}
 */
export const VALID_NAME_PATTERN = /^[a-zA-Z_]{1}[a-zA-Z0-9_-]{0,126}$/;

/**
 * DynamicField is a wrapper for fields which would not be ideal as a map because
 * you don't know what the field name is going to be until runtime or the number
 * of fields you'll end up having will be too large.
 *
 * A common use case is a polling or custom form service.  Eventually the number of
 * fields you have is in the thousands and systems like SQL, ElasticSearch will not
 * do well with that many fields.  DynamicField is designed to be a "named union".
 *
 * For example:
 *  [
 *      // the name of the field
 *      'name' => 'your-field-name',
 *      // only one of the following values can be populated.
 *      'bool_val' => true,
 *      'date_val' => '2015-12-25',
 *      'float_val' => 1.0,
 *      'int_val' => 1,
 *      'string_val' => 'string',
 *      'text_val' => 'some text',
 *  ]
 */
export default class DynamicField {
  /**
   * @param {string} name
   * @param {*} kind
   * @param {*} value
   *
   * @throws {AssertionFailed}
   */
  constructor(name, kind, value) {
    if (!isString(name)) {
      throw new AssertionFailed('DynamicField name must be a string.');
    }

    if (!(kind instanceof DynamicFieldKind)) {
      throw new AssertionFailed('DynamicField kind was expected to be an instance of DynamicFieldKind.');
    }

    if (!VALID_NAME_PATTERN.test(name)) {
      throw new AssertionFailed(`DynamicField [${name}] is invalid. It must match the pattern [${VALID_NAME_PATTERN}].`);
    }

    Object.defineProperty(this, 'name', { value: name });
    Object.defineProperty(this, 'kind', { value: `${kind}` });

    const field = createField(this.kind);
    const decodedValue = field.getType().decode(value, field);
    field.guardValue(decodedValue);
    Object.defineProperty(this, 'value', { value: decodedValue });

    Object.freeze(this);
  }

  /**
   * @param {string} json
   *
   * @returns {DynamicField}
   *
   * @throws {AssertionFailed}
   */
  static fromJSON(json) {
    let obj;

    try {
      obj = JSON.parse(json);
    } catch (e) {
      throw new AssertionFailed('Invalid JSON.');
    }

    return DynamicField.fromObject(obj);
  }

  /**
   * @param {Object} obj
   *
   * @returns {DynamicField}
   *
   * @throws {AssertionFailed}
   */
  static fromObject(obj = {}) {
    if (!obj.name) {
      throw new AssertionFailed('DynamicField "name" property must be set.');
    }

    const kind = Object.keys(obj).filter(key => key !== 'name').pop();

    try {
      return new DynamicField(obj.name, DynamicFieldKind.create(kind), obj[kind]);
    } catch (e) {
      throw new AssertionFailed(`DynamicField "${kind}" is invalid.`);
    }
  }

  /**
   * @param {string} name
   * @param {boolean} value
   *
   * @return {DynamicField}
   */
  static createBoolVal(name, value = false) {
    return new DynamicField(name, DynamicFieldKind.BOOL_VAL, value);
  }

  /**
   * @param {string} name
   * @param {Date} value
   *
   * @return {DynamicField}
   */
  static createDateVal(name, value) {
    return new DynamicField(name, DynamicFieldKind.DATE_VAL, value);
  }

  /**
   * @param {string} name
   * @param {number} value
   *
   * @return {DynamicField}
   */
  static createFloatVal(name, value = 0.0) {
    return new DynamicField(name, DynamicFieldKind.FLOAT_VAL, value);
  }

  /**
   * @param {string} name
   * @param {number} value
   *
   * @return {DynamicField}
   */
  static createIntVal(name, value = 0) {
    return new DynamicField(name, DynamicFieldKind.INT_VAL, value);
  }

  /**
   * @param {string} name
   * @param {string} value
   *
   * @return {DynamicField}
   */
  static createStringVal(name, value) {
    return new DynamicField(name, DynamicFieldKind.STRING_VAL, value);
  }

  /**
   * @param {string} name
   * @param {string} value
   *
   * @return {DynamicField}
   */
  static createTextVal(name, value) {
    return new DynamicField(name, DynamicFieldKind.TEXT_VAL, value);
  }

  /**
   * @returns {string}
   */
  getName() {
    return this.name;
  }

  /**
   * @returns {string}
   */
  getKind() {
    return this.kind;
  }

  /**
   * @returns {Field}
   */
  getField() {
    return createField(this.kind);
  }

  /**
   * @returns {*}
   */
  getValue() {
    return this.value;
  }

  /**
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this);
  }

  /**
   * @returns {Object}
   */
  toObject() {
    const field = createField(this.kind);
    return {
      name: this.name,
      [this.kind]: field.getType().encode(this.value, field),
    };
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * @returns {string}
   */
  valueOf() {
    return this.toString();
  }

  /**
   * @param {DynamicField} other
   *
   * @returns {boolean}
   */
  equals(other) {
    return this.name === other.name
      && this.kind === other.kind
      && this.value === other.value;
  }
}
