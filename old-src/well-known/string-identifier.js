'use strict';

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

export default class StringIdentifier extends SystemUtils.mixinClass(Identifier)
{
  /**
   * @param string string
   *
   * @throws \InvalidArgumentException
   */
  constructor(string) {
    super(); // require before using `this`

    if ('string' !== typeof string) {
      throw new InvalidArgumentException('String expected but got [' + StringUtils.varToString(string) + '].');
    }

    privateProps.set(this, {
      /** @var string */
      string: String(string).trim()
    });

    if (!privateProps.get(this).string || privateProps.get(this).string.length === 0) {
      throw new InvalidArgumentException('String cannot be empty.');
    }
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
    return privateProps.get(this).string;
  }

  /**
   * {@inheritdoc}
   */
  equals(other) {
    return this.toString() == other.toString();
  }
}
