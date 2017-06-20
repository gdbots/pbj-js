/* eslint-disable class-methods-use-this */
import Fb from '../../src/FieldBuilder';
import Mixin from '../../src/Mixin';
import SchemaId from '../../src/SchemaId';
import T from '../../src/Type';

export default class SampleMixinV2 extends Mixin {
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
