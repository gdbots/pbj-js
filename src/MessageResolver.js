import MoreThanOneMessageForMixin from './exceptions/MoreThanOneMessageForMixin';
import NoMessageForCurie from './exceptions/NoMessageForCurie';
import NoMessageForMixin from './exceptions/NoMessageForMixin';
import NoMessageForQName from './exceptions/NoMessageForQName';
import NoMessageForSchemaId from './exceptions/NoMessageForSchemaId';
import SchemaCurie from './SchemaCurie';
import SchemaId from './SchemaId';

/**
 * A map of all the available messages keyed by the schema resolver key
 * and curies for resolution that is only major version specific.
 *
 * @type {Map}
 */
const messages = new Map();

/**
 * An map of resolved messages in this request/process.
 *
 * @type {Map}
 */
const resolved = new Map();

/**
 * A map of resolved lookups by mixin, keyed by the mixin id with major rev
 * and optionally a package and category (for faster lookups)
 * @see SchemaId.getCurieMajor
 *
 * @type {Map}
 */
const resolvedMixins = new Map();

/**
 * A map of resolved lookups by qname.
 *
 * @type {Map}
 */
const resolvedQnames = new Map();

export default class MessageResolver {
  /**
   * Returns all of the registered messages.
   *
   * @returns {Message[]}
   */
  static all() {
    return Array.from(messages.values());
  }

  /**
   * Returns the message to be used for the provided schema id.
   *
   * @param {SchemaId} id
   *
   * @returns {Message}
   *
   * @throws {NoMessageForSchemaId}
   */
  static resolveId(id) {
    const curieMajor = id.getCurieMajor();
    if (resolved.has(curieMajor)) {
      return resolved.get(curieMajor);
    }

    if (messages.has(curieMajor)) {
      const message = messages.get(curieMajor);
      resolved.set(curieMajor, message);
      return message;
    }

    const curie = id.getCurie().toString();
    if (messages.has(curie)) {
      const message = messages.get(curie);
      resolved.set(curieMajor, message);
      resolved.set(curie, message);
      return message;
    }

    throw new NoMessageForSchemaId(id);
  }

  /**
   * Returns the message to be used for the provided curie.
   *
   * @param {SchemaCurie} curie
   *
   * @returns {Message}
   *
   * @throws {NoMessageForCurie}
   */
  static resolveCurie(curie) {
    const key = curie.toString();
    if (resolved.has(key)) {
      return resolved.get(key);
    }

    if (messages.has(key)) {
      const message = messages.get(key);
      resolved.set(key, message);
      return message;
    }

    throw new NoMessageForCurie(curie);
  }

  /**
   * Returns the SchemaCurie for the given SchemaQName.
   *
   * @param {SchemaQName} qname
   *
   * @returns {SchemaCurie}
   *
   * @throws {NoMessageForQName}
   */
  static resolveQName(qname) {
    const key = qname.toString();
    if (resolvedQnames.has(key)) {
      return resolvedQnames.get(key);
    }

    const qvendor = qname.getVendor();
    const qmessage = qname.getMessage();

    const keys = Array.from(messages.keys());
    const l = keys.length;
    for (let i = 0; i < l; i += 1) {
      const [vendor, pkg, category, message] = keys[i].split(':');
      if (qvendor === vendor && qmessage === message) {
        const curie = SchemaCurie.fromString(`${vendor}:${pkg}:${category}:${message}`);
        resolvedQnames.set(key, curie);
        return curie;
      }
    }

    throw new NoMessageForQName(qname);
  }

  /**
   * Adds a single schema and class proto to the resolver.
   * @see SchemaId.getCurieMajor
   *
   * @param {SchemaId|string} id         - A SchemaId instance, curie string or curie major string.
   * @param {Message}         classProto - The Message class itself, not an instance.
   */
  static register(id, classProto) {
    const key = id instanceof SchemaId ? id.getCurieMajor() : `${id}`;
    messages.set(key, classProto);
  }

  /**
   * Return the one schema expected to be using the provided mixin.
   *
   * @param {Mixin} mixin
   * @param {?string} inPackage
   * @param {?string} inCategory
   *
   * @returns {Schema}
   *
   * @throws {MoreThanOneMessageForMixin}
   * @throws {NoMessageForMixin}
   */
  static findOneUsingMixin(mixin, inPackage = null, inCategory = null) {
    const schemas = this.findAllUsingMixin(mixin, inPackage, inCategory);
    if (schemas.length !== 1) {
      throw new MoreThanOneMessageForMixin(mixin, schemas);
    }

    return schemas[0];
  }

  /**
   * Returns an array of Schemas expected to be using the provided mixin.
   *
   * @param {Mixin} mixin
   * @param {?string} inPackage
   * @param {?string} inCategory
   *
   * @return {Schema[]}
   *
   * @throws {NoMessageForMixin}
   */
  static findAllUsingMixin(mixin, inPackage = null, inCategory = null) {
    const mixinId = mixin.getId().getCurieMajor();
    const key = `${mixinId}${inPackage}${inCategory}`;
    let schemas;

    if (!resolvedMixins.has(key)) {
      const filtered = inPackage || inCategory;
      schemas = [];
      messages.forEach((message, id) => {
        if (filtered) {
          const [, pkg, category] = id.split(':');
          if (inPackage && inPackage !== pkg) {
            return;
          }

          if (inCategory && inCategory !== category) {
            return;
          }
        }

        const schema = message.schema();
        if (schema.hasMixin(mixinId)) {
          schemas.push(schema);
        }
      });

      resolvedMixins.set(key, schemas);
    } else {
      schemas = resolvedMixins.get(key);
    }

    if (!schemas.length) {
      throw new NoMessageForMixin(mixin);
    }

    return schemas;
  }
}
