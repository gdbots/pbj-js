import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';
import FieldAlreadyDefined from './Exception/FieldAlreadyDefined';
import FieldNotDefined from './Exception/FieldNotDefined';
import FieldOverrideNotCompatible from './Exception/FieldOverrideNotCompatible';
import MixinAlreadyAdded from './Exception/MixinAlreadyAdded';
import MixinNotDefined from './Exception/MixinNotDefined';
import Fb from './FieldBuilder';
import SchemaId, { VALID_PATTERN } from './SchemaId';
import StringType from './Type/StringType';

export const PBJ_FIELD_NAME = '_schema';

export default class Schema {
  /**
   * @param {SchemaId|string} id
   * @param {Message} classProto
   * @param {Field[]} fields
   * @param {Mixin[]} mixins
   */
  constructor(id, classProto, fields = [], mixins = []) {
    this.id = id instanceof SchemaId ? id : SchemaId.fromString(id);
    this.classProto = classProto;
    this.fields = new Map();
    this.requiredFields = new Map();
    this.mixins = new Map();
    this.mixinsByCurie = new Map();
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

    mixins.forEach(m => this.addMixin(m));
    fields.forEach(f => this.addField(f));

    this.mixinIds = Array.from(this.mixins.keys());
    this.mixinCuries = Array.from(this.mixinsByCurie.keys());

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
   * @private
   *
   * @param {Mixin} mixin
   *
   * @throws {MixinAlreadyAdded}
   */
  addMixin(mixin) {
    const id = mixin.getId();
    const curieStr = id.getCurie().toString();

    if (this.mixinsByCurie.has(curieStr)) {
      throw new MixinAlreadyAdded(this, this.mixinsByCurie.get(curieStr), mixin);
    }

    this.mixins.set(id.getCurieMajor(), mixin);
    this.mixinsByCurie.set(curieStr, mixin);
    mixin.getFields().forEach(f => this.addField(f));
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
   * Convenience method to return the name of the method that should
   * exist to handle this message.
   *
   * For example, an ImportUserV1 message would be handled by:
   * SomeClass.importUserV1(command)
   *
   * @param {boolean} withMajor
   *
   * @returns {string}
   */
  getHandlerMethodName(withMajor = false) {
    return withMajor ? this.classNameMethodMajor : this.classNameMethod;
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
   * Convenience method that creates a message instance with this schema.
   *
   * @param {Object} data
   *
   * @returns {Message}
   */
  createMessage(data = {}) {
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
   * @param {string} mixinId
   *
   * @returns {boolean}
   */
  hasMixin(mixinId) {
    return this.mixins.has(mixinId) || this.mixinsByCurie.has(mixinId);
  }

  /**
   * @param {string} mixinId
   *
   * @returns {Mixin}
   *
   * @throws {MixinNotDefined}
   */
  getMixin(mixinId) {
    if (this.mixins.has(mixinId)) {
      return this.mixins.get(mixinId);
    }

    if (this.mixinsByCurie.has(mixinId)) {
      return this.mixinsByCurie.get(mixinId);
    }

    throw new MixinNotDefined(this, mixinId);
  }

  /**
   * @returns {Mixin[]}
   */
  getMixins() {
    return Array.from(this.mixins.values());
  }

  /**
   * Returns an array of curies with the major rev.
   * @see SchemaId.getCurieMajor
   *
   * @returns {string[]}
   */
  getMixinIds() {
    return this.mixinIds;
  }

  /**
   * Returns an array of curies (string version).
   *
   * @returns {string[]}
   */
  getMixinCuries() {
    return this.mixinCuries;
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
      mixins: this.getMixins().map(m => m.getId()),
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
