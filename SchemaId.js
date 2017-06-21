/* eslint-disable no-useless-escape */

import InvalidSchemaId from './Exception/InvalidSchemaId';
import SchemaCurie from './SchemaCurie';
import SchemaVersion from './SchemaVersion';

/**
 * We store all SchemaId instances to accomplish a loose flyweight strategy.
 * Loose because we're not strictly enforcing it, but internally in this
 * library we only use the factory from* methods to create curies.
 *
 * @type {Map}
 */
const instances = new Map();

/**
 * Regular expression pattern for matching a valid SchemaId string.
 * @type {RegExp}
 */
export const VALID_PATTERN = /^pbj:([a-z0-9-]+):([a-z0-9\.-]+):([a-z0-9-]+)?:([a-z0-9-]+):([0-9]+-[0-9]+-[0-9]+)$/;

/**
 * Schemas have fully qualified names, similar to a "urn".  This is combination of ideas from:
 *
 * Amazon Resource Names (ARNs) and AWS Service Namespaces
 * @link http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html
 *
 * SnowPlow Analytics (Iglu)
 * @link http://snowplowanalytics.com/blog/2014/07/01/iglu-schema-repository-released/
 *
 * @link http://en.wikipedia.org/wiki/CURIE
 *
 * And of course the various package managers like composer, npm, etc.
 *
 * Schema Id Format:
 *  pbj:vendor:package:category:message:version
 *
 * Schema Curie Format:
 *  vendor:package:category:message
 *
 * Schema Curie Major Format:
 *  vendor:package:category:message:v#
 *
 * Schema QName Format:
 *  vendor:message
 *
 * Formats:
 *  VENDOR:   [a-z0-9-]+
 *  PACKAGE:  [a-z0-9\.-]+
 *  CATEGORY: ([a-z0-9-]+)?
 *  (clarifies the intent of the message, e.g. command, request, event, response, etc.)
 *
 *  MESSAGE:  [a-z0-9-]+
 *  VERSION:  @see SchemaVersion VALID_PATTERN
 *
 * Examples of fully qualified schema ids:
 *  pbj:acme:videos:event:video-uploaded:1-0-0
 *  pbj:acme:users:command:register-user:1-1-0
 *  pbj:acme:api.videos:request:get-video:1-0-0
 *
 * The fully qualified schema identifier corresponds to a json schema implementing the
 * Gdbots PBJ Json Schema.
 *
 * The schema id must be resolveable to a php class that should be able to read and write
 * messages with payloads that validate using the json schema.  The target class is ideally
 * major revision specific.  As in GetVideoV1, GetVideoV2, etc.  Only "major" revisions
 * should require a unique class since all other schema changes should not break anything.
 *
 * @see SchemaVersion
 *
 */
export default class SchemaId {
  /**
   * @param {string} vendor
   * @param {string} pkg
   * @param {?string} category
   * @param {string} message
   * @param {string} version
   *
   * @throws {InvalidSchemaId}
   */
  constructor(vendor, pkg, category, message, version) {
    this.vendor = vendor || '';
    this.pkg = pkg || '';
    this.category = `${category}`.trim() || null;
    this.message = message || '';
    this.version = SchemaVersion.fromString(version);
    this.id = `pbj:${this.vendor}:${this.pkg}:${this.category || ''}:${this.message}:${this.version}`;

    if (!VALID_PATTERN.test(this.id)) {
      throw new InvalidSchemaId(`SchemaId [${this.id}] is invalid. It must match the pattern [${VALID_PATTERN}].`);
    }

    if (this.id.length > 150) {
      throw new InvalidSchemaId('SchemaId cannot be greater than 150 chars.');
    }

    this.curie = SchemaCurie.fromId(this);
    Object.freeze(this);
    instances.set(this.id, this);
  }

  /**
   * @param {string} id
   *
   * @returns {SchemaId}
   */
  static fromString(id) {
    const key = `${id}`;
    if (instances.has(key)) {
      return instances.get(key);
    }

    return new SchemaId(...key.substr(4).split(':'));
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
   * @returns {SchemaVersion}
   */
  getVersion() {
    return this.version;
  }

  /**
   * @returns {SchemaCurie}
   */
  getCurie() {
    return this.curie;
  }

  /**
   * Returns the major version qualified curie.  This should be used by the MessageResolver,
   * event dispatchers, etc. where consumers will need to be able to reliably type hint or
   * locate classes and provide functionality for a given message, with the expectation
   * that a major revision is likely not compatible with another major revision of the
   * same message.
   *
   * e.g. "vendor:package:category:message:v1"
   *
   * @returns {string}
   */
  getCurieMajor() {
    return `${this.curie}:v${this.version.getMajor()}`;
  }

  /**
   * @return {SchemaQName}
   */
  getQName() {
    return this.curie.getQName();
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.id;
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
   * @param {SchemaId} other
   *
   * @returns {boolean}
   */
  equals(other) {
    return `${this}` === `${other}`;
  }
}