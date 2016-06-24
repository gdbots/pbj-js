'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

export default class MixinAlreadyAdded extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Schema schema
   * @param Mixin  originalMixin
   * @param Mixin  duplicateMixin
   */
  constructor(schema, originalMixin, duplicateMixin) {
    super('Mixin with id [' + duplicateMixin.getId().toString() + '] was already added from [' + originalMixin.getId().toString() + '] to message [' + schema.getClassName() + ']. You cannot add multiple versions of the same mixin.');

    privateProps.set(this, {
      /** @var Schema */
      schema: schema,

      /** @var Mixin */
      originalMixin: originalMixin,

      /** @var Mixin */
      duplicateMixin: duplicateMixin
    });
  }

  /**
   * @return Mixin
   */
  getOriginalMixin() {
    return privateProps.get(this).originalMixin;
  }

  /**
   * @return Mixin
   */
  getDuplicateMixin() {
    return privateProps.get(this).duplicateMixin;
  }
}
