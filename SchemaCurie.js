/* eslint-disable comma-dangle, no-useless-escape */

import InvalidSchemaCurie from './Exception/InvalidSchemaCurie';
import SchemaQName from './SchemaQName';

/**
 * We store all SchemaCurie instances to accomplish a loose flyweight strategy.
 * Loose because we're not strictly enforcing it, but internally in this
 * library we only use the factory from* methods to create curies.
 *
 * @type {Map}
 */
const instances = new Map();

/**
 * Regular expression pattern for matching a valid SchemaCurie string.
 * @type {RegExp}
 */
export const VALID_PATTERN = /^([a-z0-9-]+):([a-z0-9\.-]+):([a-z0-9-]+)?:([a-z0-9-]+)$/;

/**
 * Schemas can be fully qualified by the schema id (which includes the version)
 * or the short form which is called a CURIE or "compact uri".
 * @link http://en.wikipedia.org/wiki/CURIE
 *
 * Schema Curie Format:
 *  vendor:package:category:message
 *
 * @see SchemaId
 *
 */
export default class SchemaCurie {
  /**
   * @param {string} vendor
   * @param {string} pkg
   * @param {?string} category
   * @param {string} message
   *
   * @throws {InvalidSchemaCurie}
   */
  constructor(vendor, pkg, category, message) {
    this.vendor = vendor;
    this.pkg = pkg;
    this.category = `${category}`.trim() || null;
    this.message = message;
    this.curie = `${vendor}:${pkg}:${this.category || ''}:${message}`;

    if (!VALID_PATTERN.test(this.curie)) {
      throw new InvalidSchemaCurie(`SchemaCurie [${this.curie}] is invalid. It must match the pattern [${VALID_PATTERN}].`);
    }

    this.qname = SchemaQName.fromCurie(this);
    Object.freeze(this);
    instances.set(this.curie, this);
  }

  /**
   * @param {string} value
   *
   * @returns {SchemaCurie}
   */
  static fromString(value) {
    if (instances.has(value)) {
      return instances.get(value);
    }

    return new SchemaCurie(...value.split(':'));
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
  getPackage() {
    return this.pkg;
  }

  /**
   * @returns {?string}
   */
  getCategory() {
    return this.category;
  }

  /**
   * @returns {string}
   */
  getMessage() {
    return this.message;
  }

  /**
   * @returns {boolean}
   */
  isMixin() {
    return this.category === 'mixin';
  }

  /**
   * @return {SchemaQName}
   */
  getQName() {
    return this.qname;
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.curie;
  }

  /**
   * @returns {string}
   */
  toJSON() {
    return this.toString();
  }

  /**
   * @returns {string}
   */
  valueOf() {
    return this.toString();
  }

  /**
   * @param {SchemaCurie} other
   *
   * @returns {boolean}
   */
  equals(other) {
    return this.toString() === other.toString();
  }
}