'use strict';

import ArrayUtils from 'gdbots/common/util/array-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import NoMessageForCurie from 'gdbots/pbj/exception/no-message-for-curie';
import NoMessageForSchemaId from 'gdbots/pbj/exception/no-message-for-schema-id';
import NoMessageForMixin from 'gdbots/pbj/exception/no-message-for-mixin';
import NoMessageForQName from 'gdbots/pbj/exception/no-message-for-q-name';
import MoreThanOneMessageForMixin from 'gdbots/pbj/exception/more-than-one-message-for-mixin';
import SchemaCurie from 'gdbots/pbj/schema-curie';

let _registerPromise = null;
let _messages = {};
let _resolved = {};
let _resolvedQnames = {};
let _resolvedMixins = {};

export default class MessageResolver
{
  /**
   * Used when dynamically loading messages.
   *
   * @see self::registerMap
   *
   * @var Promise
   */
  static registerPromise() {
    return _registerPromise || Promise.resolve(true);
  }

  /**
   * An array of all the available messages keyed by the schema resolver key
   * and curies for resolution that is not version specific.
   *
   * @var array
   */
  static messages() {
    return _messages;
  }

  /**
   * An array of resolved messages in this request.
   *
   * @var array
   */
  static resolved() {
    return _resolved;
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
    return _resolvedMixins;
  }

  /**
   * An array of resolved lookups by qname.
   *
   * @see SchemaQName
   *
   * @var SchemaCurie[]
   */
  static resolvedQnames() {
    return _resolvedQnames;
  }

  /**
   * Returns all of the registed schemas.
   *
   * @var Message[]
   */
  static all() {
    return _messages;
  }

  /**
   * Returns the Message to be used for the provided schema id.
   *
   * @param {SchemaId} id
   *
   * @return Message
   *
   * @throws NoMessageForSchemaId
   */
  static resolveId(id) {
    let curieMajor = id.getCurieMajor();
    if (-1 !== Object.keys(_resolved).indexOf(curieMajor)) {
      return _resolved[curieMajor];
    }

    let message = null;

    if (-1 !== Object.keys(_messages).indexOf(curieMajor)) {
      message = _messages[curieMajor];
      _resolved[curieMajor] = message;
      return message;
    }

    let curie = id.getCurie().toString();
    if (-1 !== Object.keys(_messages).indexOf(curie)) {
      message = _messages[curie];
      _resolved[curieMajor] = message;
      _resolved[curie] = message;
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
    if (-1 !== Object.keys(_resolved).indexOf(key)) {
      return _resolved[key];
    }

    if (-1 !== Object.keys(_messages).indexOf(key)) {
      let message = _messages[key];
      _resolved[key] = message;
      return message;
    }

    throw new NoMessageForCurie(curie);
  }

  /**
   * Returns the SchemaCurie for the given SchemaQName.
   *
   * @param SchemaQName $qname
   *
   * @return SchemaCurie
   *
   * @throws NoMessageForQName
   */
  static resolveQName(qname) {
    let key = qname.toString();
    if (-1 !== Object.keys(_resolvedQnames).indexOf(key)) {
      return _resolvedQnames[key];
    }

    let qvendor = qname.getVendor();
    let qmessage = qname.getMessage();

    ArrayUtils.each(_messages, function(message, id) {
      let parts = id.split(':', 4);
      let vendor = parts[0];
      let packageName = parts[1] || null;
      let category = parts[2] || null;
      message = parts[3] || null;

      if (qvendor === vendor && qmessage === message) {
        _resolvedQnames[key] = SchemaCurie.fromString(vendor + ':' + packageName + ':' + category + ':' + message);
        return;
      }
    });

    if (-1 === Object.keys(_resolvedQnames).indexOf(key)) {
      throw new NoMessageForQName(qname);
    }

    return _resolvedQnames[key];
  }

  /**
   * Adds a single message to the resolver. This is used in tests or dynamic
   * message creation (not a typical use case).
   *
   * @param Message message
   * @param Schema  schema
   */
  static registerSchema(message, schema) {
    _messages[schema.getId().getCurieMajor()] = message;
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
    if ('SchemaId' === SystemUtils.getClass(id)) {
      id = id.getCurieMajor();
    }

    _messages[id] = message;
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
        if ('object' === typeof value && value.hasTrait('Message')) {
          _messages[message.schema().getId().getCurieMajor()] = message;
        } else {
          promises.push(SystemUtils.import(value));
        }
      }
    });

    _registerPromise = Promise.all(promises).then(function(messages) {
      ArrayUtils.each(messages, function(message) {

        // @todo: check removing the `default` property
        message = message.default;

        _messages[message.schema().getId().getCurieMajor()] = message;
      }.bind(this));

      _registerPromise = null;
    }.bind(this));
  }

  /**
   * Return the one message expected to be using the provided mixin.
   *
   * @param Mixin  mixin
   * @param string inPackage
   * @param string inCategory
   *
   * @return Message
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
   * @return Message[]
   *
   * @throws NoMessageForMixin
   */
  static findAllUsingMixin(mixin, inPackage = null, inCategory = null) {
    let mixinId = mixin.getId().getCurieMajor();
    let key = mixinId + inPackage + inCategory;

    /** @var Message[] */
    let messages = [];

    if (-1 === Object.keys(_resolvedMixins).indexOf(key)) {
      let filtered = (inPackage && inPackage.length) || (inCategory && inCategory.length);

      ArrayUtils.each(_messages, function(message, id) {
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

      _resolvedMixins[key] = messages;
    } else {
      messages = _resolvedMixins[key];
    }

    if (!messages || messages.length === 0) {
      throw new NoMessageForMixin(mixin);
    }

    return messages;
  }
}