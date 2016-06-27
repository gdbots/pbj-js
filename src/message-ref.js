'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import FromArray from 'gdbots/common/from-array';
import ToArray from 'gdbots/common/to-array';
import SchemaCurie from 'gdbots/pbj/schema-curie';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

/**
 * Represents a reference to a message. Typically used to link messages
 * together via a correlator or "links". Format for a reference:
 * vendor:package:category:message:id#tag (tag is optional)
 */
export default class MessageRef extends SystemUtils.mixinClass(null, FromArray, ToArray)
{
  /**
   * @param SchemaCurie curie
   * @param string      id
   * @param string      tag The tag will be automatically fixed to a slug-formatted-string.
   *
   * @throws \Exception
   */
  constructor(curie, id, tag = null) {
    super(); // require before using `this`

    privateProps.set(this, {
      /** @var SchemaCurie */
      curie: curie,

      /**
       * Any string matching pattern /^[\w\/\.:-]+/
       *
       * @var string
       */
      id: id || 'null',

      /** @var string */
      tag: null
    });

    if (false === /^[\w\/\.:-]+/.test(privateProps.get(this).id)) {
      throw new Error('MessageRef.id');
    }

    if (null !== tag) {
      privateProps.get(this).tag = tag.toString().toLowerCase()
                                      .replace(/\s+/g, '-')     // Replace spaces with -
                                      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                                      .replace(/\-\-+/g, '-')   // Replace multiple - with single -
                                      .replace(/^-+/, '')       // Trim - from start of text
                                      .replace(/-+$/, '');      // Trim - from end of text
    }

    if (privateProps.get(this).curie.isMixin()) {
      throw new Error('Mixins cannot be used in a MessageRef.');
    }
  }

  /**
   * {@inheritdoc}
   */
  static fromArray(data = {}) {
    if (data.curie || false) {
      let id = data.id || 'null';
      let tag = data.tag || null;

      return new this(SchemaCurie.fromString(data.curie), id, tag);
    }

    throw new Error('Payload must be a MessageRef type.');
  }

  /**
   * {@inheritdoc}
   */
  toArray() {
    if (null !== privateProps.get(this).tag) {
      return {
        'curie': privateProps.get(this).curie.toString(),
        'id': privateProps.get(this).id,
        'tag': privateProps.get(this).tag
      };
    }

    return {
      'curie': privateProps.get(this).curie.toString(),
      'id': privateProps.get(this).id
    };
  }

  /**
   * @param string string A string with format curie:id#tag
   *
   * @return self
   */
  static fromString(string) {
    let parts = string.split('#', 2);
    let ref = parts[0];
    let tag = parts[1] || null;

    parts = ref.split(':', 5);
    let id = parts.pop();
    let curie = SchemaCurie.fromString(parts.join(':'));

    return new this(curie, id, tag);
  }

  /**
   * @return string
   */
  toString() {
    if (null !== privateProps.get(this).tag) {
      return privateProps.get(this).curie.toString() + ':' + privateProps.get(this).id + '#' + privateProps.get(this).tag;
    }

    return privateProps.get(this).curie.toString() + ':' + privateProps.get(this).id;
  }

  /**
   * @return SchemaCurie
   */
  getCurie() {
    return privateProps.get(this).curie;
  }

  /**
   * @return bool
   */
  hasId() {
    return 'null' != privateProps.get(this).id;
  }

  /**
   * @return string
   */
  getId() {
    return privateProps.get(this).id;
  }

  /**
   * @return bool
   */
  hasTag() {
    return null !== privateProps.get(this).tag;
  }

  /**
   * @return string
   */
  getTag() {
    return privateProps.get(this).tag;
  }

  /**
   * @param MessageRef other
   *
   * @return bool
   */
  equals(other) {
    return this.toString() === other.toString();
  }
}
