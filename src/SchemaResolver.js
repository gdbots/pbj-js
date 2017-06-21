import NoSchemaForSchemaId from './Exception/NoSchemaForSchemaId';

/**
 * A map of all the available schemas keyed by the schema resolver key
 * and curies for resolution that is not version specific.
 *
 * @type {Map}
 */
const schemas = new Map();

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

export default class SchemaResolver {
  /**
   * Returns all of the registed schemas.
   *
   * @returns {Schema[]}
   */
  static all() {
    return Array.from(schemas.values());
  }

  /**
   * Returns the schema to be used for the provided schema id.
   *
   * @param {SchemaId} id
   *
   * @returns {Schema}
   *
   * @throws {NoSchemaForSchemaId}
   */
  static resolveId(id) {
    const curieMajor = id.getCurieMajor();
    if (schemas.has(curieMajor)) {
      return schemas.get(curieMajor);
    }

    if (schemas.has(curieMajor)) {
      const schema = schemas.get(curieMajor);
      schemas.set(curieMajor, schema);
      return schema;
    }

    const curie = id.getCurie.toString();
    if (schemas.has(curie)) {
      const schema = schemas.get(curie);
      schemas.set(curieMajor, schema);
      schemas.set(curie, schema);
      return schema;
    }

    throw new NoSchemaForSchemaId(id);
  }

  /**
   * Adds a single schema to the resolver.  This is used in tests or dynamic
   * message schema creation (not a typical use case).
   *
   * @param {Schema} schema
   */
  static registerSchema(schema) {
    schemas.set(schema.getId().getCurieMajor(), schema);
  }
}
