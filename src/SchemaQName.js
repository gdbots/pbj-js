/* eslint-disable comma-dangle */

import InvalidSchemaQName from './Exception/InvalidSchemaQName';

/**
 * We store all SchemaQName instances to accomplish a loose flyweight strategy.
 * Loose because we're not strictly enforcing it, but internally in this
 * library we only use the factory from* methods to create qnames.
 *
 * @type {Map}
 */
const instances = new Map();

/**
 * Regular expression pattern for matching a valid SchemaQName string.
 * @type {RegExp}
 */
export const VALID_PATTERN = /^([a-z0-9-]+):([a-z0-9-]+)$/;

/**
 * Schemas can be referenced in an extremely compact manner using a QName.
 * This is NOT 100% reliably unique as the larger your app is the more likely the
 * same message name will be duplicated in another service.
 * @link https://en.wikipedia.org/wiki/QName
 *
 * Schema QName Format:
 *  vendor:message
 *
 * @see SchemaId
 * @see SchemaCurie
 *
 */
export default class SchemaQName {
  /**
   * @param {string} vendor
   * @param {string} message
   *
   * @throws {InvalidSchemaVersion}
   */
  constructor(vendor, message) {
    this.vendor = vendor;
    this.message = message;
    this.qname = `${vendor}:${message}`;

    if (!VALID_PATTERN.test(this.qname)) {
      throw new InvalidSchemaQName(
        `SchemaQName [${this.qname}] is invalid. It must match the pattern [${VALID_PATTERN}].`
      );
    }

    Object.freeze(this);
    instances.set(this.qname, this);
  }

  /**
   * @param {string} qname - A valid SchemaQName as a string, e.g. vendor:message
   *
   * @returns {SchemaQName}
   *
   * @throws {InvalidSchemaQName}
   */
  static fromString(qname) {
    if (instances.has(qname)) {
      return instances.get(qname);
    }

    const matches = `${qname}`.match(VALID_PATTERN);
    if (matches === null) {
      throw new InvalidSchemaQName(
        `SchemaQName [${qname}] is invalid. It must match the pattern [${VALID_PATTERN}].`
      );
    }

    return new SchemaQName(matches[1], matches[2]);
  }

  /**
   * @param {SchemaId} id
   *
   * @returns {SchemaQName}
   */
  static fromId(id) {
    return this.fromCurie(id.getCurie());
  }

  /**
   * @param {SchemaCurie} curie
   *
   * @returns {SchemaQName}
   */
  static fromCurie(curie) {
    const qname = `${curie.getVendor()}:${curie.getMessage()}`;
    if (instances.has(qname)) {
      return instances.get(qname);
    }

    return new SchemaQName(curie.getVendor(), curie.getMessage());
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.qname;
  }

  /**
   * @returns {string}
   */
  toJSON() {
    return this.qname;
  }

  /**
   * @returns {string}
   */
  valueOf() {
    return this.qname;
  }

  /**
   * @returns {string}
   */
  getVendor() {
    return this.vendor;
  }

  /**
   * @returns {string}
   */
  getMessage() {
    return this.message;
  }
}
