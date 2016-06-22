'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import FromArray from 'gdbots/common/from-array';
import ToArray from 'gdbots/common/to-array';
import SchemaCurie from 'gdbots/pbj/schema-curie';

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

    /** @var SchemaCurie */
    this.curie = curie;

    /**
     * Any string matching pattern /^[\w\/\.:-]+/
     *
     * @var string
     */
    this.id = id || 'null';
    if (false === /^[\w\/\.:-]+/.test(this.id)) {
      throw new Error('MessageRef.id');
    }

    /** @var string */
    if (null !== tag) {
      this.tag = tag.toString().toLowerCase()
                    .replace(/\s+/g, '-')     // Replace spaces with -
                    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
                    .replace(/^-+/, '')       // Trim - from start of text
                    .replace(/-+$/, '');      // Trim - from end of text
    }

    if (this.curie.isMixin()) {
      throw new Error('Mixins cannot be used in a MessageRef.');
    }
  }

  /**
   * {@inheritdoc}
   */
  static fromArray(data = {}) {
    if (data.curie || false) {
      id = data.id || 'null';
      tag = data.tag || null;

      return new this(SchemaCurie.fromString(data.curie), id, tag);
    }

    throw new Error('Payload must be a MessageRef type.');
  }

  /**
   * {@inheritdoc}
   */
  toArray() {
    if (null !== this.tag) {
      return {
        'curie': this.curie.toString(),
        'id': this.id,
        'tag': this.tag
      };
    }

    return {
      'curie': this.curie.toString(),
      'id': this.id
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
    if (null !== this.tag) {
      return this.curie.toString() + ':' + this.id + '#' + this.tag;
    }

    return this.curie.toString() + ':' + this.id;
  }

  /**
   * @return SchemaCurie
   */
  getCurie() {
    return this.curie;
  }

  /**
   * @return bool
   */
  hasId() {
    return 'null' != this.id;
  }

  /**
   * @return string
   */
  getId() {
    return this.id;
  }

  /**
   * @return bool
   */
  hasTag() {
    return null !== this.tag;
  }

  /**
   * @return string
   */
  getTag() {
    return this.tag;
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
