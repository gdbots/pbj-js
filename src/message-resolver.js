'use strict';

import ArrayUtils from 'gdbots/common/util/array-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import SchemaId from 'gdbots/pbj/schema-id';

let messages = {};
let resolved = {};
let resolvedMixins = {};

export default class MessageResolver
{
  /**
   * An array of all the available class names keyed by the schema resolver key
   * and curies for resolution that is not version specific.
   *
   * @var array
   */
  static messages() {
    return messages;
  }

  /**
   * An array of resolved messages in this request.
   *
   * @var array
   */
  static resolved() {
    return resolved;
  }

  /**
   * An array of resolved lookups by mixin, keyed by the mixin id with major rev
   * and optionally a package and category (for faster lookups)
   * @see SchemaId::getCurieMajor
   *
   * @var Schema[]
   */
  static resolvedMixins() {
    return resolvedMixins;
  }

  /**
   * Returns the fully qualified php class name to be used for the provided schema id.
   *
   * @param SchemaId id
   *
   * @return string
   *
   * @throws NoMessageForSchemaId
   */
  static resolveId(id) {
    curieMajor = id.getCurieMajor();
    if (curieMajor in this.resolved) {
      return this.resolved[curieMajor];
    }

    if (curieMajor in this.messages) {
      className = this.messages[curieMajor];
      this.resolved[curieMajor] = className;
      return className;
    }

    curie = id.getCurie().toString();
    if (curie in this.messages) {
      className = this.messages[curie];
      this.resolved[curieMajor] = className;
      this.resolved[curie] = className;
      return className;
    }

    throw new NoMessageForSchemaId(id);
  }

  /**
   * Returns the fully qualified php class name to be used for the provided curie.
   *
   * @param SchemaCurie curie
   *
   * @return string
   *
   * @throws NoMessageForCurie
   */
  static resolveCurie(curie) {
    key = curie.toString();
    if (key in this.resolved) {
      return this.resolved[key];
    }

    if (key in this.messages) {
      className = this.messages[key];
      this.resolved[key] = className;
      return className;
    }

    throw new NoMessageForCurie(curie);
  }

  /**
   * Adds a single schema to the resolver. This is used in tests or dynamic
   * message schema creation (not a typical use case).
   *
   * @param Schema schema
   */
  static registerSchema(schema) {
    this.messages[schema.getId().getCurieMajor()] = schema.getClassName();
  }

  /**
   * Adds a single schema id and class name.
   * @see SchemaId::getCurieMajor
   *
   * @param SchemaId|string id
   * @param string          className
   */
  static register(id, className) {
    if (id instanceof SchemaId) {
      id = id.getCurieMajor();
    }
    this.messages[id] = className;
  }

  /**
   * Registers an array of id => className values to the resolver.
   *
   * @param array map
   */
  static registerMap(map = {}) {
    if (this.messages.length === 0) {
      this.messages = map;
      return;
    }

    ArrayUtils.each(map, function(value, key) {
      if (map.hasOwnProperty(key)) {
        this.messages[key] = value;
      }
    }.bind(this));
  }

  /**
   * Return the one schema expected to be using the provided mixin.
   *
   * @param Mixin  mixin
   * @param string inPackage
   * @param string inCategory
   *
   * @return Promise -> Schema
   *
   * @throws MoreThanOneMessageForMixin
   * @throws NoMessageForMixin
   */
  static findOneUsingMixin(mixin, inPackage = null, inCategory = null) {
    return this.findAllUsingMixin(mixin, inPackage, inCategory).then(function(schemas) {
      if (1 !== schemas.length) {
        throw new MoreThanOneMessageForMixin(mixin, schemas);
      }

      return schemas[0];
    });
  }

  /**
   * Returns an array of Schemas expected to be using the provided mixin.
   *
   * @param Mixin  mixin
   * @param string inPackage
   * @param string inCategory
   *
   * @return Promise -> Schema[]
   *
   * @throws NoMessageForMixin
   */
  static findAllUsingMixin(mixin, inPackage = null, inCategory = null) {
    let mixinId = mixin.getId().getCurieMajor();
    let key = mixinId + inPackage + inCategory;

    /** @var Message[] */
    let promises = [];

    if (!(key in this.resolvedMixins)) {
      let filtered = (inPackage && inPackage.length) || (inCategory && inCategory.length);

      ArrayUtils.each(this.messages, function(messageClass, id) {
        if (filtered) {
          let curie = id.split(':');

          if (inPackage && inPackage.length && curie[1] != inPackage) {
            return;
          }

          if (inCategory && inCategory.length && curie[2] != inCategory) {
            return;
          }
        }

        promises.push(SystemUtils.import(messageClass));
      });
    } else {
      return Promise.resolve(this.resolvedMixins[key]);
    }

    if (promises.length === 0) {
      throw new NoMessageForMixin(mixin);
    }

    return Promise.all(promises).then(function(messages) {

      /** @var Message[] */
      let schemas = [];

      ArrayUtils.each(messages, function(message) {

        // @todo: check removing the `default` property
        message = message.default;

        let schema = message.schema();
        if (schema.hasMixin(mixinId)) {
          schemas.push(schema);
        }
      });

      this.resolvedMixins[key] = schemas;

      return schemas;
    }.bind(this));
  }
}
