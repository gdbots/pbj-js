/* eslint-disable no-useless-escape */

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
    this.vendor = vendor || '';
    this.pkg = pkg || '';
    this.category = `${category}`.trim() || null;
    this.message = message || '';
    this.curie = `${this.vendor}:${this.pkg}:${this.category || ''}:${this.message}`;

    if (!VALID_PATTERN.test(this.curie)) {
      throw new InvalidSchemaCurie(
        `SchemaCurie [${this.curie}] is invalid. It must match the pattern [${VALID_PATTERN}].`,
      );
    }

    if (this.curie.length > 145) {
      throw new InvalidSchemaCurie('SchemaCurie cannot be greater than 145 chars.');
    }

    this.qname = SchemaQName.fromCurie(this);
    Object.freeze(this);
    instances.set(this.curie, this);
  }

  /**
   * @param {string} curie
   *
   * @returns {SchemaCurie}
   */
  static fromString(curie) {
    const key = `${curie}`;
    if (instances.has(key)) {
      return instances.get(key);
    }

    return new SchemaCurie(...key.split(':'));
  }

  /**
   * @param {SchemaId} id
   *
   * @returns {SchemaCurie}
   */
  static fromId(id) {
    return SchemaCurie.fromString(id.toString().replace(`:${id.getVersion()}`, '').substr(4));
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
