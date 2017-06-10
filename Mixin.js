/* eslint-disable class-methods-use-this */
import SchemaId from './SchemaId';

/** @type Mixin */
let instance = null;

export default class Mixin {
  constructor() {
    Object.freeze(this);
  }

  /**
   * @returns {Mixin}
   */
  static create() {
    if (instance === null) {
      instance = new Mixin();
    }

    return instance;
  }

  /**
   * @returns {SchemaId}
   */
  getId() {
    return SchemaId.fromString('gdbots:pbj:mixin:undefined:1-0-0');
  }

  /**
   * @returns {Field[]}
   */
  getFields() {
    return [];
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.getId().toString();
  }

  /**
   * @returns {Object}
   */
  toObject() {
    return {
      id: this.getId(),
      fields: this.getFields()
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
   * @param {Mixin} other
   *
   * @returns {boolean}
   */
  equals(other) {
    return this.toString() === other.toString();
  }
}