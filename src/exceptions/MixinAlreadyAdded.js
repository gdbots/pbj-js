import SchemaException from './SchemaException';

export default class MixinAlreadyAdded extends SchemaException {
  /**
   * @param {Schema} schema
   * @param {Mixin}  originalMixin
   * @param {Mixin}  duplicateMixin
   */
  constructor(schema, originalMixin, duplicateMixin) {
    super(`Mixin with id [${duplicateMixin.getId()}] was already added from [${originalMixin.getId()}] to message [${schema.getId()}]. You cannot add multiple versions of the same mixin.`);
    this.schema = schema;
    this.originalMixin = originalMixin;
    this.duplicateMixin = duplicateMixin;
  }

  /**
   * @returns {Mixin}
   */
  getOriginalMixin() {
    return this.originalMixin;
  }

  /**
   * @returns {Mixin}
   */
  getDuplicateMixin() {
    return this.duplicateMixin;
  }
}
