import NoMessageForSchemaId from './Exception/NoMessageForSchemaId';

/**
 * A map of all the available messages keyed by the schema resolver key
 * and curies for resolution that is not version specific.
 *
 * @type {Map}
 */
const messages = new Map();

/**
 * A map of resolved lookups by mixin, keyed by the mixin id with major rev
 * and optionally a package and category (for faster lookups)
 * @see SchemaId.getCurieMajor
 *
 * @type {Map}
 */
// const resolvedMixins = new Map();

/**
 * A map of resolved lookups by qname.
 *
 * @type {Map}
 */
// const resolvedQnames = new Map();

export default class MessageResolver {
  /**
   * Returns all of the registed messages.
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
    if (messages.has(curieMajor)) {
      return messages.get(curieMajor);
    }

    const curie = id.getCurie().toString();
    if (messages.has(curie)) {
      const message = messages.get(curie);
      messages.set(curieMajor, message);
      return message;
    }

    throw new NoMessageForSchemaId(id);
  }

  /**
   * Adds a single schema to the resolver.  This is used in tests or dynamic
   * message schema creation (not a typical use case).
   *
   * @param {Schema} schema
   */
  static registerSchema(schema) {
    messages.set(schema.getId().getCurieMajor(), schema.getClassProto());
  }
}