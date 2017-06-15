/* eslint-disable class-methods-use-this */
import Fb from '../../src/FieldBuilder';
import Message from '../../src/Message';
import MessageRef from '../../src/MessageRef';
import Schema from '../../src/Schema';
import * as T from '../../src/Type';
import SampleMixinV1 from './SampleMixinV1';

export default class SampleMessageV1 extends Message {
  /**
   * @private
   *
   * @returns {Schema}
   */
  static defineSchema() {
    return new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
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

  /**
   * @param {?string} tag
   *
   * @returns {MessageRef}
   */
  generateMessageRef(tag = null) {
    return new MessageRef(this.schema().getCurie(), this.get('string_single'), tag);
  }

  /**
   * @returns {Object}
   */
  getUriTemplateVars() {
    return {
      string_single: this.get('string_single'),
    };
  }
}
