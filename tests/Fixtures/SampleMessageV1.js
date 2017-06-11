/* eslint-disable class-methods-use-this */
import Fb from '../../src/FieldBuilder';
import Message from '../../src/Message';
import Schema from '../../src/Schema';
import * as T from '../../src/Type';
import SampleMixinV1 from './SampleMixinV1';

/** @type {Schema} */
let schema = null;

export default class SampleMessageV1 extends Message {
  /**
   * @returns {Schema}
   */
  static schema() {
    if (schema === null) {
      schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
        [
          Fb.create('string_single', T.StringType.create())
            .build(),
          Fb.create('string_set', T.StringType.create())
            .asASet()
            .build(),
          Fb.create('string_list', T.StringType.create())
            .asAList()
            .build(),
          Fb.create('string_map', T.StringType.create())
            .asAMap()
            .build(),
        ],
        [
          SampleMixinV1.create(),
        ],
      );
    }

    return schema;
  }

  /**
   * @returns {Schema}
   */
  schema() {
    return SampleMessageV1.schema();
  }
}
