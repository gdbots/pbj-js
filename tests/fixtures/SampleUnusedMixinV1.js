/* eslint-disable class-methods-use-this */
import Mixin from '../../src/Mixin';
import SchemaId from '../../src/SchemaId';

export default class SampleUnusedMixinV1 extends Mixin {
  /**
   * @returns {SchemaId}
   */
  getId() {
    return SchemaId.fromString('pbj:gdbots:pbj.tests::sample-unused-mixin:1-0-0');
  }
}
