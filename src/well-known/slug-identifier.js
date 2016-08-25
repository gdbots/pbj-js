'use strict';

import SlugUtils from 'gdbots/common/util/slug-utils';
import StringUtils from 'gdbots/common/util/string-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import InvalidArgumentException from 'gdbots/pbj/exception/invalid-argument-exception';
import Identifier from 'gdbots/pbj/well-known/identifier';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class SlugIdentifier extends SystemUtils.mixinClass(Identifier)
{
  /**
   * @param string slug
   *
   * @throws \InvalidArgumentException
   */
  constructor(slug) {
    super(); // require before using `this`

    if ('string' !== typeof slug) {
      throw new InvalidArgumentException('String expected but got [' + StringUtils.varToString(slug) + '].');
    }

    if (!SlugUtils.isValid(slug)) {
      throw new InvalidArgumentException('The value [' + slug + '] is not a valid slug.');
    }

    privateProps.set(this, {
      /** @var string */
      slug: slug
    });
  }

  /**
   * @param string string
   *
   * @return static
   */
  static create(string) {
    return new this(SlugUtils.create(string));
  }

  /**
   * {@inheritdoc}
   */
  static fromString(string) {
    return new this(string);
  }

  /**
   * {@inheritdoc}
   */
  toString() {
    return privateProps.get(this).slug;
  }

  /**
   * {@inheritdoc}
   */
  equals(other) {
    return this.toString() == other.toString();
  }
}
