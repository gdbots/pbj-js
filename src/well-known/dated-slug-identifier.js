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

export default class DatedSlugIdentifier extends SystemUtils.mixinClass(Identifier)
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

    if (!SlugUtils.isValid(slug, true) || !SlugUtils.containsDate(slug)) {
      throw new InvalidArgumentException('The value [' + slug + '] is not a valid dated slug.');
    }

    privateProps.set(this, {
      /** @var string */
      slug: slug
    });
  }

  /**
   * @param string string
   * @param Date   date
   *
   * @return static
   */
  static create(string, date) {
    let slug = new this(SlugUtils.create(string));

    if (!SlugUtils.containsDate(slug)) {
      date = date ? date : new Date();

      slug = SlugUtils.addDate(slug, date);
    }

    return new this(slug);
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
