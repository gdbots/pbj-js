/* eslint-disable class-methods-use-this */
import Fb from '../../src/FieldBuilder';
import Mixin from '../../src/Mixin';
import SchemaId from '../../src/SchemaId';
import * as T from '../../src/Type';

/** @type {SampleMixinV1} */
let instance = null;

export default class SampleMixinV1 extends Mixin {
  /**
   * @returns {SampleMixinV1}
   */
  static create() {
    if (instance === null) {
      instance = new SampleMixinV1();
    }

    return instance;
  }

  /**
   * @returns {SchemaId}
   */
  getId() {
    return SchemaId.fromString('pbj:gdbots:pbj.tests::sample-mixin:1-0-0');
  }

  /**
   * @returns {Field[]}
   */
  getFields() {
    return [
      Fb.create('mixin_string', T.StringType.create())
        .overridable(true)
        .build(),
      Fb.create('mixin_int', T.IntType.create())
        .required()
        .build(),
    ];
  }
}
