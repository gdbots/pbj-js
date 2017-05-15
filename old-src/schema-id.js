'use strict';

import InvalidSchemaId from 'gdbots/pbj/exception/invalid-schema-id';
import SchemaCurie from 'gdbots/pbj/schema-curie';
import SchemaVersion from 'gdbots/pbj/schema-version';

/** @var array */
let _instances = {};

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

/**
 * Regular expression pattern for matching a valid SchemaId string.
 * @constant string
 */
export const VALID_PATTERN = /^pbj:([a-z0-9-]+):([a-z0-9\.-]+):([a-z0-9-]+)?:([a-z0-9-]+):([0-9]+-[0-9]+-[0-9]+)/;

/**
 * Schemas have fully qualified names, similar to a "urn". This is combination of ideas from:
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
 *  CATEGORY: ([a-z0-9-]+)? (clarifies the intent of the message, e.g. command, request, event, response, etc.)
 *  MESSAGE:  [a-z0-9-]+
 *  VERSION:  @see SchemaVersion::VALID_PATTERN
 *
 * Examples of fully qualified schema ids:
 *  pbj:acme:videos:event:video-uploaded:1-0-0
 *  pbj:acme:users:command:register-user:1-1-0
 *  pbj:acme:api.videos:request:get-video:1-0-0
 *
 * The fully qualified schema identifier corresponds to a json schema implementing the Gdbots PBJ Json Schema.
 *
 * The schema id must be resolveable to a php class that should be able to read and write
 * messages with payloads that validate using the json schema. The target class is ideally
 * major revision specific. As in GetVideoV1, GetVideoV2, etc. Only "major" revisions
 * should require a unique class since all other schema changes should not break anything.
 *
 * @see SchemaVersion
 *
 */
class SchemaId
{
  /**
   * @param string vendor
   * @param string packageName
   * @param string category
   * @param string message
   * @param string version
   */
  constructor(vendor, packageName, category, message, version) {
    if (!category) {
      category = '';
    }

    privateProps.set(this, {
      /** @var string */
      vendor: vendor,

      /** @var string */
      package: packageName,

      /** @var string */
      category: category,

      /** @var string */
      message: message,

      /** @var SchemaVersion */
      version: SchemaVersion.fromString(version),

      /** @var string */
      id: 'pbj:' + vendor + ':' + packageName + ':' + category + ':' + message + ':' + version.toString(),

      /**
       * The curie is the short name for the schema (without the version) that can be used
       * to reference another message without fully qualifying the version.
       *
       * @var SchemaCurie
       */
      curie: null
    });

    privateProps.get(this).curie = SchemaCurie.fromId(this);
  }

  /**
   * @param string schemaId
   *
   * @return SchemaId
   *
   * @throws InvalidSchemaId
   */
  static fromString(schemaId) {
    if (undefined !== _instances[schemaId]) {
      return _instances[schemaId];
    }

    if (schemaId.length > 145) {
      throw new Error('Schema id cannot be greater than 150 chars.');
    }

    let matches = schemaId.match(VALID_PATTERN);
    if (null === matches) {
      throw new InvalidSchemaId('Schema id [' + schemaId + '] is invalid. It must match the pattern [' + VALID_PATTERN + '].');
    }

    _instances[schemaId] = new this(matches[1], matches[2], matches[3], matches[4], matches[5]);
    return _instances[schemaId];
  }

  /**
   * @return string
   */
  toString() {
    return privateProps.get(this).id;
  }

  /**
   * @return string
   */
  getVendor() {
    return privateProps.get(this).vendor;
  }

  /**
   * @return string
   */
  getPackage() {
    return privateProps.get(this).package;
  }

  /**
   * @return string
   */
  getCategory() {
    return privateProps.get(this).category;
  }

  /**
   * @return string
   */
  getMessage() {
    return privateProps.get(this).message;
  }

  /**
   * @return SchemaVersion
   */
  getVersion() {
    return privateProps.get(this).version;
  }

  /**
   * @return SchemaCurie
   */
  getCurie() {
    return privateProps.get(this).curie;
  }

  /**
   * Returns the major version qualified curie. This should be used by the MessageResolver,
   * event dispatchers, etc. where consumers will need to be able to reliably type hint or
   * locate classes and provide functionality for a given message, with the expectation
   * that a major revision is likely not compatible with another major revision of the
   * same message.
   *
   * e.g. "vendor:package:category:message:v1"
   *
   * @return string
   */
  getCurieMajor() {
    return privateProps.get(this).curie.toString() + ':v' + privateProps.get(this).version.getMajor();
  }
}