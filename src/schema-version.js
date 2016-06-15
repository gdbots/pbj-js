'use strict';

import InvalidSchemaVersion from 'gdbots/pbj/exception/invalid-schema-version';

/**
 * Regular expression pattern for matching a valid SchemaVersion string.
 * @constant string
 */
export const VALID_PATTERN = /^([0-9]+)-([0-9]+)-([0-9]+)/;

/**
 * Similar to semantic versioning but with dashes and no "alpha, beta, etc." qualifiers.
 *
 * E.g. 1-0-0 (major-minor-patch)
 *
 * MAJOR
 * Is incremented when a change is made which breaks the rules of Protobuf/Thrift backward compatibility,
 * such as changing the type of a field.
 *
 * MINOR
 * Is a change which is backward compatible but not forward compatible. Records created from
 * the old version of the schema can be deserialized using the new schema, but not the other way
 * around. Example: adding a new field to a union type.
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
export default class SchemaVersion
{
  /**
   * @param int major
   * @param int minor
   * @param int patch
   */
  constructor(major = 1, minor = 0, patch = 0) {

    /** @var int */
    this.major = parseInt(major);

    /** @var int */
    this.minor = parseInt(minor);

    /** @var int */
    this.patch = parseInt(patch);

    /**
     * E.g. 1-0-0 (major-minor-patch)
     *
     * @var string
     */
    this.version = this.major + '-' + this.minor + '-' + this.patch;
  }

  /**
   * @param string version SchemaVersion string, e.g. 1-0-0
   *
   * @return SchemaVersion
   *
   * @throws InvalidSchemaVersion
   */
  static fromString(version = '1-0-0') {
    let matches = version.match(VALID_PATTERN);
    if (null === matches) {
      throw new InvalidSchemaVersion('Schema version [' + version + '] is invalid. It must match the pattern [' + VALID_PATTERN + '].');
    }

    return new this(matches[1], matches[2], matches[3]);
  }

  /**
   * @return string
   */
  toString() {
    return this.version;
  }

  /**
   * @return int
   */
  getMajor() {
    return this.major;
  }

  /**
   * @return int
   */
  getMinor() {
    return this.minor;
  }

  /**
   * @return int
   */
  getPatch() {
    return this.patch;
  }
}
