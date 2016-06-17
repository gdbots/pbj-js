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
   * An array of all the available messages keyed by the schema resolver key
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
   *
   * @see SchemaId::getCurieMajor
   *
   * @var Message[]
   */
  static resolvedMixins() {
    return resolvedMixins;
  }

  /**
   * Returns the Message to be used for the provided schema id.
   *
   * @param SchemaId id
   *
   * @return Message
   *
   * @throws NoMessageForSchemaId
   */
  static resolveId(id) {
    let curieMajor = id.getCurieMajor();
    if (-1 !== Object.keys(this.resolved).indexOf(curieMajor)) {
      return this.resolved[curieMajor];
    }

    let message = null;

    if (-1 !== Object.keys(this.messages).indexOf(curieMajor)) {
      message = this.messages[curieMajor];
      this.resolved[curieMajor] = message;
      return message;
    }

    let curie = id.getCurie().toString();
    if (-1 !== Object.keys(this.messages).indexOf(curie)) {
      message = this.messages[curie];
      this.resolved[curieMajor] = message;
      this.resolved[curie] = message;
      return message;
    }

    throw new NoMessageForSchemaId(id);
  }

  /**
   * Returns the Message to be used for the provided curie.
   *
   * @param SchemaCurie curie
   *
   * @return Message
   *
   * @throws NoMessageForCurie
   */
  static resolveCurie(curie) {
    let key = curie.toString();
    if (-1 !== Object.keys(this.resolved).indexOf(key)) {
      return this.resolved[key];
    }

    if (-1 !== Object.keys(this.messages).indexOf(key)) {
      let message = this.messages[key];
      this.resolved[key] = message;
      return message;
    }

    throw new NoMessageForCurie(curie);
  }

  /**
   * Adds a single message to the resolver. This is used in tests or dynamic
   * message creation (not a typical use case).
   *
   * @param Message message
   * @param Schema  schema
   */
  static registerSchema(message, schema) {
    this.messages[schema.getId().getCurieMajor()] = message;
  }

  /**
   * Adds a single schema id and message.
   *
   * @see SchemaId::getCurieMajor
   *
   * @param SchemaId|string id
   * @param Message         message
   */
  static register(id, message) {
    if (id instanceof SchemaId) {
      id = id.getCurieMajor();
    }

    this.messages[id] = message;
  }

  /**
   * Registers an array of id => messagePath values to the resolver.
   *
   * @param array map
   */
  static registerMap(map = {}) {
    let promises = [];

    ArrayUtils.each(map, function(value, key) {
      if (map.hasOwnProperty(key)) {
        promises.push(SystemUtils.import(value));
      }
    });

    Promise.all(promises).then(function(messages) {
      ArrayUtils.each(messages, function(message) {
        this.messages[message.schema().getId().getCurieMajor()] = message;
      }.bind(this));
    }.bind(this));
  }

  /**
   * Return the one message expected to be using the provided mixin.
   *
   * @param Mixin  mixin
   * @param string inPackage
   * @param string inCategory
   *
   * @return Promise -> Message
   *
   * @throws MoreThanOneMessageForMixin
   * @throws NoMessageForMixin
   */
  static findOneUsingMixin(mixin, inPackage = null, inCategory = null) {
    let messages = this.findAllUsingMixin(mixin, inPackage, inCategory);
    if (1 !== messages.length) {
      throw new MoreThanOneMessageForMixin(mixin, messages);
    }

    return messages[0];
  }

  /**
   * Returns an array of messages expected to be using the provided mixin.
   *
   * @param Mixin  mixin
   * @param string inPackage
   * @param string inCategory
   *
   * @return Promise -> Message[]
   *
   * @throws NoMessageForMixin
   */
  static findAllUsingMixin(mixin, inPackage = null, inCategory = null) {
    let mixinId = mixin.getId().getCurieMajor();
    let key = mixinId + inPackage + inCategory;

    /** @var Message[] */
    let messages = [];

    if (-1 === Object.keys(this.resolvedMixins).indexOf(key)) {
      let filtered = (inPackage && inPackage.length) || (inCategory && inCategory.length);

      ArrayUtils.each(this.messages, function(message, id) {
        if (filtered) {
          let curie = id.split(':');

          if (inPackage && inPackage.length && curie[1] != inPackage) {
            return;
          }

          if (inCategory && inCategory.length && curie[2] != inCategory) {
            return;
          }
        }

        let schema = message.schema();
        if (schema.hasMixin(mixinId)) {
          messages.push(message);
        }
      });

      this.resolvedMixins[key] = messages;
    } else {
      messages = this.resolvedMixins[key];
    }

    if (!messages || messages.length === 0) {
      throw new NoMessageForMixin(mixin);
    }

    return messages;
  }
}
