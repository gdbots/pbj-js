'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import GdbotsPbjException from 'gdbots/pbj/exception/gdbots-pbj-exception';

export default class MixinAlreadyAdded extends SystemUtils.mixinClass(GdbotsPbjException)
{
  /**
   * @param Schema schema
   * @param Mixin  originalMixin
   * @param Mixin  duplicateMixin
   */
  constructor(schema, originalMixin, duplicateMixin) {
    super('Mixin with id [' + duplicateMixin.getId().toString() + '] was already added from [' + originalMixin.getId().toString() + '] to message [' + schema.getClassName() + ']. You cannot add multiple versions of the same mixin.');

    /** @var Schema */
    this.schema = schema;

    /** @var Mixin */
    this.originalMixin = originalMixin;

    /** @var Mixin */
    this.duplicateMixin = duplicateMixin;
  }

  /**
   * @return Mixin
   */
  getOriginalMixin() {
    return this.originalMixin;
  }

  /**
   * @return Mixin
   */
  getDuplicateMixin() {
    return this.duplicateMixin;
  }
}
