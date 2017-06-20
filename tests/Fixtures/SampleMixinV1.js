/* eslint-disable class-methods-use-this */
import Fb from '../../src/FieldBuilder';
import Mixin from '../../src/Mixin';
import SchemaId from '../../src/SchemaId';
import T from '../../src/Type';

export default class SampleMixinV1 extends Mixin {
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
