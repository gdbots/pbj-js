import Fb from '../../src/FieldBuilder';
import SchemaId from '../../src/SchemaId';
import T from '../../src/types';

export default class SampleMixinV1 {
  /**
   * @returns {SchemaId}
   */
  static getId() {
    return SchemaId.fromString('pbj:gdbots:pbj.tests::sample-mixin:1-0-0');
  }

  /**
   * @returns {Field[]}
   */
  static getFields() {
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
