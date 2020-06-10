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
      SampleMixinV2.getFields().concat([
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
      ]),
      [
        'gdbots:pbj.tests:mixin:one:v1',
        'gdbots:pbj.tests:mixin:one',
      ],
    );
  }
}

SampleTraitV2(SampleMessageV2);
MessageResolver.registerMessage('gdbots:pbj.tests::sample-message:v2', SampleMessageV2);
Object.freeze(SampleMessageV2);
Object.freeze(SampleMessageV2.prototype);
