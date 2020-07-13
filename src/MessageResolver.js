import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import MoreThanOneMessageForMixin from './exceptions/MoreThanOneMessageForMixin';
import NoMessageForCurie from './exceptions/NoMessageForCurie';
import NoMessageForMixin from './exceptions/NoMessageForMixin';
import NoMessageForQName from './exceptions/NoMessageForQName';
import NoMessageForSchemaId from './exceptions/NoMessageForSchemaId';
import SchemaCurie from './SchemaCurie';
import SchemaId from './SchemaId';
import SchemaQName from './SchemaQName';

async function resolveImport(resolver) {
  const result = await (isFunction(resolver) ? resolver() : resolver);
  return result.default || result;
}

let defaultVendor = '';
let manifestResolver = () => false;

/**
 * An object of all the available schemas keyed by a curie.
 * The values are dynamic imports.
 *
 * @type {Object}
 */
const messages = {};

/**
 * A object of SchemaCurie instances resolved lookups by qname.
 *
 * @type {Object}
 */
const resolvedQnames = {};

export default class MessageResolver {
  /**
   * An object of dynamic imports keyed by a curie major.
   * {
   *   'acme:news:node:article:v1': () => import('@acme/schemas/acme/news/node/ArticleV1'),
   * },
   *
   * @param {Object} imports
   */
  static register(imports) {
    Object.assign(messages, imports);
  }

  /**
   * Adds a single message to the resolver. This is used in tests or dynamic
   * message schema creation (not a typical or recommended use case).
   *
   * @param {string} curie
   * @param {Message} classProto
   */
  static registerMessage(curie, classProto) {
    messages[curie] = Promise.resolve({ default: classProto });
  }

  /**
   * Returns all of the registered messages. Key is the curie major
   * and the value is a promise (a dynamic import).
   *
   * @returns {Object}
   */
  static all() {
    return messages;
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
  static async resolveId(id) {
    const curieMajor = id.getCurieMajor();
    if (messages[curieMajor]) {
      try {
        return await resolveImport(messages[curieMajor]);
      } catch (e) {
      }
    }

    throw new NoMessageForSchemaId(id);
  }

  /**
   * Returns true if the provided curie exists.
   *
   * @param {SchemaCurie|string} curie
   *
   * @returns {boolean}
   */
  static hasCurie(curie) {
    const key = `${curie}`.replace('*', defaultVendor);
    if (messages[key]) {
      return true;
    }

    for (const curie of Object.keys(messages)) {
      if (curie.startsWith(key)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns the message to be used for the provided curie.
   *
   * @param {SchemaCurie|string} curie
   *
   * @returns {Message}
   *
   * @throws {NoMessageForCurie}
   */
  static async resolveCurie(curie) {
    const key = `${curie}`.replace('*', defaultVendor);
    if (messages[key]) {
      try {
        return await resolveImport(messages[key]);
      } catch (e) {
      }
    }

    const latest = Object.keys(messages).filter(curie => curie.startsWith(key)).sort().pop();
    if (messages[latest]) {
      messages[key] = messages[latest];
      try {
        return await resolveImport(messages[key]);
      } catch (e) {
      }
    }

    throw new NoMessageForCurie(SchemaCurie.fromString(curie));
  }

  /**
   * Returns true if the provided qname exists.
   *
   * @param {SchemaQName|string} qname
   *
   * @returns {boolean}
   */
  static hasQName(qname) {
    try {
      this.findCurieByQName(qname);
    } catch (e) {
      return false;
    }

    return true;
  }

  /**
   * Returns the Message for the given SchemaQName.
   *
   * @param {SchemaQName|string} qname
   *
   * @returns {Message}
   *
   * @throws {NoMessageForQName}
   */
  static async resolveQName(qname) {
    return this.resolveCurie(this.findCurieByQName(qname));
  }

  /**
   * @param {SchemaQName|string} qname
   *
   * @returns {SchemaCurie}
   *
   * @throws {NoMessageForQName}
   */
  static findCurieByQName(qname) {
    let realQname = qname;
    if (isString(qname)) {
      realQname = SchemaQName.fromString(qname.replace('*', defaultVendor));
    }

    const key = realQname.toString();
    if (resolvedQnames[key]) {
      return resolvedQnames[key];
    }

    const qvendor = realQname.getVendor();
    const qmessage = realQname.getMessage();

    for (const curie of Object.keys(messages)) {
      const [vendor, pkg, category, message] = curie.split(':');
      if (qvendor === vendor && qmessage === message) {
        const curie = SchemaCurie.fromString(`${vendor}:${pkg}:${category}:${message}`);
        resolvedQnames[key] = curie;
        return curie;
      }
    }

    throw new NoMessageForQName(realQname);
  }

  /**
   * Return true if any messages are using the provided mixin (a curie major).
   *
   * @param {string} mixin
   *
   * @returns {boolean}
   */
  static async hasAnyUsingMixin(mixin) {
    const curies = await this.findAllUsingMixin(mixin);
    return curies.length > 0;
  }

  /**
   * Return the one curie expected to be using the provided mixin (a curie major).
   *
   * @param {string} mixin
   * @param {boolean} returnWithMajor
   *
   * @returns {string}
   *
   * @throws {MoreThanOneMessageForMixin}
   * @throws {NoMessageForMixin}
   */
  static async findOneUsingMixin(mixin, returnWithMajor = true) {
    const curies = await this.findAllUsingMixin(mixin, returnWithMajor);
    if (curies.length === 1) {
      return curies[0];
    } else if (curies.length === 0) {
      throw new NoMessageForMixin(mixin);
    } else {
      throw new MoreThanOneMessageForMixin(mixin, curies);
    }
  }

  /**
   * Returns an array of curies of messages using the provided mixin (a curie major).
   *
   * @param {string} mixin
   * @param {boolean} returnWithMajor
   *
   * @return {string[]}
   *
   * @throws {NoMessageForMixin}
   */
  static async findAllUsingMixin(mixin, returnWithMajor = true) {
    let curies;
    try {
      curies = await resolveImport(manifestResolver(mixin.replace(/:/g, '/')));
    } catch (e) {
      curies = [];
    }

    if (returnWithMajor) {
      return curies;
    }

    return curies.map(curie => curie.substr(0, curie.lastIndexOf(':')));
  }

  /**
   * Resolving a curie or qname can be done without knowing the vendor ahead of time
   * by using an '*' in a (qname) '*:article' or '*:news:node:article' (curie).
   * The '*' will get replaced with the default vendor, e.g. 'acme:article'.
   *
   * @param {string} vendor
   */
  static setDefaultVendor(vendor) {
    defaultVendor = vendor;
  }

  /**
   * @returns {string}
   */
  static getDefaultVendor() {
    return defaultVendor;
  }

  /**
   * Finding messages using a mixin's curie major requires that
   * it load a manifest file (generated by gdbots/pbjc) which
   * contains an array of curies.
   *
   * e.g. @acme-schemas/manifests/gdbots/ncr/mixin/node/v1.js
   * export default [
   *   'acme:news:node:article:v1',
   *   'acme:videos:node:video:v1',
   * ];
   *
   * In order to do this a function must be supplied that has
   * the directory baked in so bundlers can predict all the
   * dynamic import paths optimally.
   *
   * e.g. in @acme-schemas/index.js it would call:
   * MessageResolver.setManifestResolver(file => import(`./manifests/${file}`));
   *
   * @param {Function} resolver
   */
  static setManifestResolver(resolver) {
    manifestResolver = resolver;
  }

  /**
   * @returns {Function}
   */
  static getManifestResolver() {
    return manifestResolver;
  }
}
