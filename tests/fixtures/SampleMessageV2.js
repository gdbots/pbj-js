/* eslint-disable class-methods-use-this */
import Fb from '../../src/FieldBuilder';
import Message from '../../src/Message';
import MessageResolver from '../../src/MessageResolver';
import Schema from '../../src/Schema';
import T from '../../src/types';
import SampleMixinV2 from './SampleMixinV2';
import SampleTraitV2 from './SampleTraitV2';

export default class SampleMessageV2 extends Message {
  /**
   * @private
   *
   * @returns {Schema}
   */
  static defineSchema() {
    return new Schema('pbj:gdbots:pbj.tests::sample-message:2-0-0', SampleMessageV2,
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
        SampleMixinV2.create(),
      ],
    );
  }
}

SampleTraitV2(SampleMessageV2);
MessageResolver.register('gdbots:pbj.tests::sample-message', SampleMessageV2);
Object.freeze(SampleMessageV2);
Object.freeze(SampleMessageV2.prototype);
