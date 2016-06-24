'use strict';

import InvalidSchemaCurie from 'gdbots/pbj/exception/invalid-schema-curie';

/** @var array */
let _instances = {};

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

/**
 * Regular expression pattern for matching a valid SchemaCurie string.
 * @constant string
 */
export const VALID_PATTERN = /^([a-z0-9-]+):([a-z0-9\.-]+):([a-z0-9-]+)?:([a-z0-9-]+)/;

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
export default class SchemaCurie
{
  /**
   * @param string vendor
   * @param string packageName
   * @param string category
   * @param string message
   */
  constructor(vendor, packageName, category, message) {
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

      /** @var string */
      curie: vendor + ':' + packageName + ':' + category + ':' + message
    });
  }

  /**
   * @param SchemaId id
   *
   * @return SchemaCurie
   */
  static fromId(id) {
    let curie = id.toString().replace(':' + id.getVersion().toString(), '').substr(4);

    if (undefined !== _instances[curie]) {
      return _instances[curie];
    }

    _instances[curie] = new this(id.getVendor(), id.getPackage(), id.getCategory(), id.getMessage());
    return _instances[curie];
  }

  /**
   * @param string curie
   *
   * @return SchemaCurie
   *
   * @throws InvalidSchemaCurie
   */
  static fromString(curie) {
    if (undefined !== _instances[curie]) {
      return _instances[curie];
    }

    if (curie.length > 145) {
      throw new Error('Schema curie cannot be greater than 145 chars.');
    }

    let matches = curie.match(VALID_PATTERN);
    if (null === matches) {
      throw new InvalidSchemaCurie('Schema curie [' + curie + '] is invalid. It must match the pattern [' + VALID_PATTERN + '].');
    }

    _instances[curie] = new this(matches[1], matches[2], matches[3], matches[4]);
    return _instances[curie];
  }

  /**
   * @return string
   */
  toString() {
    return privateProps.get(this).curie;
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
   * @return bool
   */
  isMixin() {
    return 'mixin' === privateProps.get(this).category;
  }
}
