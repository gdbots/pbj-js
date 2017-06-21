/* eslint-disable class-methods-use-this */
import LogicException from './Exception/LogicException';

/**
 * We store all Mixin instances to accomplish a loose flyweight strategy.
 * Loose because we're not strictly enforcing it, but internally in this
 * library we only use the factory create method to create mixins.
 *
 * @type {Map}
 */
const instances = new Map();

export default class Mixin {
  constructor() {
    Object.freeze(this);
  }

  /**
   * @returns {Mixin}
   */
  static create() {
    if (!instances.has(this)) {
      instances.set(this, new this());
    }

    return instances.get(this);
  }

  /**
   * @returns {SchemaId}
   */
  getId() {
    throw new LogicException('You must implement "getId" in your Mixin.');
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
   * @param {Mixin} other
   *
   * @returns {boolean}
   */
  equals(other) {
    return `${this}` === `${other}`;
  }
}
