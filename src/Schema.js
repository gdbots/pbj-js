import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';
import FieldAlreadyDefined from './exceptions/FieldAlreadyDefined';
import FieldNotDefined from './exceptions/FieldNotDefined';
import FieldOverrideNotCompatible from './exceptions/FieldOverrideNotCompatible';
import Fb from './FieldBuilder';
import SchemaId, { VALID_PATTERN } from './SchemaId';
import StringType from './types/StringType';

export const PBJ_FIELD_NAME = '_schema';

export default class Schema {
  /**
   * @param {SchemaId|string} id
   * @param {Message} classProto
   * @param {Field[]} fields
   * @param {string[]} mixins
   */
  constructor(id, classProto, fields = [], mixins = []) {
    this.id = id instanceof SchemaId ? id : SchemaId.fromString(id);
    this.classProto = classProto;
    this.fields = new Map();
    this.requiredFields = new Map();
    this.mixins = mixins;
    this.mixinsKeys = new Map();
    this.classNameMethod = camelCase(this.id.getCurie().getMessage());
    this.classNameMethodMajor = `${this.classNameMethod}V${this.id.getVersion().getMajor()}`;
    this.className = upperFirst(this.classNameMethodMajor);

    this.addField(
      Fb.create(PBJ_FIELD_NAME, StringType.create())
        .required()
        .pattern(VALID_PATTERN)
        .withDefault(this.id.toString())
        .build(),
    );

    fields.forEach(this.addField.bind(this));
    mixins.forEach(m => this.mixinsKeys.set(m, true));

    Object.freeze(this);
  }

  /**
   * @private
   *
   * @param {Field} field
   *
   * @throws {FieldAlreadyDefined}
   * @throws {FieldOverrideNotCompatible}
   */
  addField(field) {
    const fieldName = field.getName();

    if (this.hasField(fieldName)) {
      const existingField = this.getField(fieldName);
      if (!existingField.isOverridable()) {
        throw new FieldAlreadyDefined(this, fieldName);
      }

      if (!existingField.isCompatibleForOverride(field)) {
        throw new FieldOverrideNotCompatible(this, fieldName, field);
      }
    }

    this.fields.set(fieldName, field);
    if (field.isRequired()) {
      this.requiredFields.set(fieldName, field);
    }
  }

  /**
   * @returns {Message}
   */
  getClassProto() {
    return this.classProto;
  }

  /**
   * @returns {string}
   */
  getClassName() {
    return this.className;
  }

  /**
   * @returns {SchemaId}
   */
  getId() {
    return this.id;
  }

  /**
   * @returns {SchemaCurie}
   */
  getCurie() {
    return this.id.getCurie();
  }

  /**
   * @returns {string}
   */
  getCurieMajor() {
    return this.id.getCurieMajor();
  }

  /**
   * @returns {SchemaQName}
   */
  getQName() {
    return this.id.getCurie().getQName();
  }

  /**
   * Convenience method to return the name of the method that should
   * exist to handle this message.
   *
   * For example, an ImportUserV1 message would be handled by:
   * SomeClass.importUserV1(command)
   *
   * @param {boolean} withMajor
   * @param {?string} prefix
   *
   * @returns {string}
   */
  getHandlerMethodName(withMajor = true, prefix = null) {
    if (prefix) {
      return withMajor
        ? `${prefix}${this.className}`
        : `${prefix}${upperFirst(this.classNameMethod)}`;
    }

    return withMajor ? this.classNameMethodMajor : this.classNameMethod;
  }

  /**
   * Convenience method that creates a message instance with this schema.
   *
   * @param {Object} data
   *
   * @returns {Message}
   */
  async createMessage(data = {}) {
    if (isEmpty(data)) {
      return this.classProto.create();
    }

    return this.classProto.fromObject(data);
  }

  /**
   * @param {string} fieldName
   *
   * @returns {boolean}
   */
  hasField(fieldName) {
    return this.fields.has(fieldName);
  }

  /**
   * @param {string} fieldName
   *
   * @returns {Field}
   *
   * @throws {FieldNotDefined}
   */
  getField(fieldName) {
    if (!this.fields.has(fieldName)) {
      throw new FieldNotDefined(this, fieldName);
    }

    return this.fields.get(fieldName);
  }

  /**
   * @returns {Field[]}
   */
  getFields() {
    return Array.from(this.fields.values());
  }

  /**
   * @returns {Field[]}
   */
  getRequiredFields() {
    return Array.from(this.requiredFields.values());
  }

  /**
   * Returns true if the mixin is on this schema.  Id provided can be
   * qualified to major rev or just the curie.
   * @see SchemaId.getCurieMajor
   *
   * @param {string} mixin
   *
   * @returns {boolean}
   */
  hasMixin(mixin) {
    return this.mixinsKeys.has(mixin);
  }

  /**
   * @returns {string[]}
   */
  getMixins() {
    return this.mixins;
  }

  /**
   * @param {SchemaCurie|string} curie
   *
   * @returns {boolean}
   */
  usesCurie(curie) {
    const key = `${curie}`;

    if (this.hasMixin(key)) {
      return true;
    }

    if (this.getCurie().toString() === key) {
      return true;
    }

    if (this.getCurieMajor() === key) {
      return true;
    }

    return false;
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.id.toString();
  }

  /**
   * @returns {Object}
   */
  toObject() {
    return {
      id: this.id.toString(),
      curie: this.getCurie().toString(),
      curie_major: this.getCurieMajor(),
      qname: this.getQName().toString(),
      class_name: this.className,
      mixins: this.mixins,
      fields: this.getFields(),
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
   * @param {Schema} other
   *
   * @returns {boolean}
   */
  equals(other) {
    return `${this}` === `${other}`;
  }
}
