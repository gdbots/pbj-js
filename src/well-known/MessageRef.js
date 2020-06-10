import trim from 'lodash/trim';
import AssertionFailed from '../exceptions/AssertionFailed';
import SchemaCurie from '../SchemaCurie';

/**
 * Regular expression pattern for matching a valid id string.
 * @type {RegExp}
 */
export const VALID_ID_PATTERN = /^[\w\/\.:-]+$/;

/**
 * Represents a reference to a message.  Typically used to link messages
 * together via a correlator or "links".  Format for a reference:
 * vendor:package:category:message:id#tag (tag is optional)
 */
export default class MessageRef {
  /**
   * @param {SchemaCurie} curie - A curie which fully qualifies what this reference is linked to.
   * @param {string}      id    - Identifier to the message.
   * @param {?string}     tag   - Tag/relationship qualifier for this ref.
   *                              NOTE: Tag is automatically normalized to a slug-formatted-string.
   *
   * @throws {AssertionFailed}
   */
  constructor(curie, id, tag = null) {
    this.curie = curie;
    // note: this is left to match php lib which at one point had literal 'null' values
    // in the id to account for (de)serialization failures.  in some future version this
    // should be removed, it's very rare.
    this.id = trim(id) || 'null';
    this.tag = trim(tag) || null;

    if (!VALID_ID_PATTERN.test(this.id)) {
      throw new AssertionFailed(`MessageRef.id [${this.id}] is invalid. It must match the pattern [${VALID_ID_PATTERN}].`);
    }

    if (this.tag !== null) {
      this.tag = this.tag.replace(/[^\w\.-]/g, '-').toLowerCase();
    }

    if (this.curie.isMixin()) {
      throw new AssertionFailed('Mixins cannot be used in a MessageRef.');
    }

    Object.freeze(this);
  }

  /**
   * @param {string} str
   *
   * @returns {MessageRef}
   */
  static fromString(str) {
    const [ref, tag = null] = str.split('#');
    const [vendor, pkg, category, message, ...id] = ref.split(':');
    const curie = SchemaCurie.fromString(`${vendor}:${pkg}:${category}:${message}`);
    return new MessageRef(curie, id.join(':'), tag);
  }

  /**
   * @param {string} json
   *
   * @returns {MessageRef}
   *
   * @throws {AssertionFailed}
   */
  static fromJSON(json) {
    let obj;

    try {
      obj = JSON.parse(json);
    } catch (e) {
      throw new AssertionFailed('Invalid JSON.');
    }

    return MessageRef.fromObject(obj);
  }

  /**
   * @param {Object} obj
   *
   * @returns {MessageRef}
   *
   * @throws {AssertionFailed}
   */
  static fromObject(obj = {}) {
    if (obj.curie && obj.id) {
      return new MessageRef(SchemaCurie.fromString(obj.curie), obj.id, obj.tag || null);
    }

    throw new AssertionFailed('MessageRef is invalid.');
  }

  /**
   * @returns {SchemaCurie}
   */
  getCurie() {
    return this.curie;
  }

  /**
   * @returns {boolean}
   */
  hasId() {
    return this.id !== 'null';
  }

  /**
   * @returns {?string}
   */
  getId() {
    return this.hasId() ? this.id : null;
  }

  /**
   * @returns {boolean}
   */
  hasTag() {
    return this.tag !== null;
  }

  /**
   * @returns {?string}
   */
  getTag() {
    return this.tag;
  }

  /**
   * @returns {string}
   */
  toString() {
    if (this.hasTag()) {
      return `${this.curie}:${this.id}#${this.tag}`;
    }

    return `${this.curie}:${this.id}`;
  }

  /**
   * @returns {Object}
   */
  toObject() {
    if (this.hasTag()) {
      return { curie: this.curie.toString(), id: this.id, tag: this.tag };
    }

    return { curie: this.curie.toString(), id: this.id };
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * @returns {string}
   */
  valueOf() {
    return this.toString();
  }

  /**
   * @param {MessageRef} other
   *
   * @returns {boolean}
   */
  equals(other) {
    return `${this}` === `${other}`;
  }
}
