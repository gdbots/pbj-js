'use strict';

import InvalidSchemaQName from 'gdbots/pbj/exception/invalid-schema-q-name';

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
export default class SchemaQName
{
  /**
   * @param string vendor
   * @param string message
   */
  constructor(vendor, message) {
    privateProps.set(this, {
      /** @var string */
      vendor: vendor,

      /** @var string */
      message: message,

      /** @var string */
      qname: vendor + ':' + message
    });
  }

  /**
   * @param SchemaId id
   *
   * @return SchemaQName
   */
  static fromId(id) {
    return this.fromCurie(id.getCurie());
  }

  /**
   * @param SchemaCurie curie
   *
   * @return SchemaQName
   */
  static fromCurie(curie) {
    let qname = curie.getVendor() + ':' + curie.getMessage();

    if (undefined !== _instances[qname]) {
      return _instances[qname];
    }

    _instances[qname] = new this(curie.getVendor(), curie.getMessage());
    return _instances[qname];
  }

  /**
   * @param string qname
   *
   * @return SchemaQName
   *
   * @throws InvalidSchemaQName
   */
  static fromString(qname) {
    if (undefined !== _instances[qname]) {
      return _instances[qname];
    }

    let matches = qname.match(VALID_PATTERN);
    if (null === matches) {
      throw new InvalidSchemaCurie('SchemaQName [' + qname + '] is invalid. It must match the pattern [' + VALID_PATTERN + '].');
    }

    _instances[qname] = new this(matches[1], matches[2]);
    return _instances[qname];
  }

  /**
   * @return string
   */
  toString() {
    return privateProps.get(this).qname;
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
  getMessage() {
    return privateProps.get(this).message;
  }
}
