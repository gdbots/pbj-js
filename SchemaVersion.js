/* eslint-disable comma-dangle */

import toInteger from 'lodash-es/toInteger';
import InvalidSchemaVersion from './Exception/InvalidSchemaVersion';

/**
 * Regular expression pattern for matching a valid SchemaVersion string.
 * @type {RegExp}
 */
export const VALID_PATTERN = /^([0-9]+)-([0-9]+)-([0-9]+)$/;

/**
 * Similar to semantic versioning but with dashes and no "alpha, beta, etc." qualifiers.
 *
 * E.g. 1-0-0 (major-minor-patch)
 *
 * MAJOR
 * Is incremented when a change is made which breaks the rules of Protobuf/Thrift backward
 * compatibility, such as changing the type of a field.
 *
 * MINOR
 * Is a change which is backward compatible but not forward compatible. Records created from
 * the old version of the schema can be deserialized using the new schema, but not the other way
 * around.  Example: adding a new field to a union type.
 *
 * PATCH
 * Is a change which is both backward compatible and forward compatible. The previous version of
 * the schema can be used to deserialize records created from the new version of the schema, and
 * vice versa. Example: adding a new optional field.
 *
 * @link http://semver.org/
 * @link http://snowplowanalytics.com/blog/2014/05/13/introducing-schemaver-for-semantic-versioning-of-schemas/
 *
 */
export default class SchemaVersion {
  /**
   * @param {number} major
   * @param {number} minor
   * @param {number} patch
   *
   * @throws {InvalidSchemaVersion}
   */
  constructor(major = 1, minor = 0, patch = 0) {
    this.major = toInteger(major);
    this.minor = toInteger(minor);
    this.patch = toInteger(patch);
    this.version = `${major}-${minor}-${patch}`;

    if (!VALID_PATTERN.test(this.version)) {
      throw new InvalidSchemaVersion(`SchemaVersion [${this.version}] is invalid. It must match the pattern [${VALID_PATTERN}].`);
    }

    Object.freeze(this);
  }

  /**
   * @param {string} version - A valid SchemaVersion as a string, e.g. 1-0-0
   *
   * @returns {SchemaVersion}
   *
   * @throws {InvalidSchemaVersion}
   */
  static fromString(version = '1-0-0') {
    const matches = `${version}`.match(VALID_PATTERN);
    if (matches === null) {
      throw new InvalidSchemaVersion(`SchemaVersion [${version}] is invalid. It must match the pattern [${VALID_PATTERN}].`);
    }

    return new SchemaVersion(matches[1], matches[2], matches[3]);
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.version;
  }

  /**
   * @returns {string}
   */
  toJSON() {
    return this.version;
  }

  /**
   * @returns {string}
   */
  valueOf() {
    return this.version;
  }

  /**
   * @returns {number}
   */
  getMajor() {
    return this.major;
  }

  /**
   * @returns {number}
   */
  getMinor() {
    return this.minor;
  }

  /**
   * @returns {number}
   */
  getPatch() {
    return this.patch;
  }
}