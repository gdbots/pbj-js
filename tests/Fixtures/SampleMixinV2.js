/* eslint-disable class-methods-use-this */
import Fb from '../../src/FieldBuilder';
import Mixin from '../../src/Mixin';
import SchemaId from '../../src/SchemaId';
import * as T from '../../src/Type';

/** @type {SampleMixinV2} */
let instance = null;

export default class SampleMixinV2 extends Mixin {
  /**
   * @returns {SampleMixinV2}
   */
  static create() {
    if (instance === null) {
      instance = new SampleMixinV2();
    }

    return instance;
  }

  /**
   * @returns {SchemaId}
   */
  getId() {
    return SchemaId.fromString('pbj:gdbots:pbj.tests::sample-mixin:2-0-0');
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
      Fb.create('mixin_date', T.DateType.create())
        .build(),
    ];
  }
}
