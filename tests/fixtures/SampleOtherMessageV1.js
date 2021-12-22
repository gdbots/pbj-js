import Fb from '../../src/FieldBuilder.js';
import Message from '../../src/Message.js';
import MessageResolver from '../../src/MessageResolver.js';
import Schema from '../../src/Schema.js';
import T from '../../src/types/index.js';
import SampleMixinV1 from './SampleMixinV1.js';
import SampleTraitV1 from './SampleTraitV1.js';

export default class SampleOtherMessageV1 extends Message {
  /**
   * @private
   *
   * @returns {Schema}
   */
  static defineSchema() {
    return new Schema('pbj:gdbots:pbj.tests::sample-other-message:1-0-0', SampleOtherMessageV1,
      SampleMixinV1.getFields().concat([
        Fb.create('test', T.StringType.create())
          .build(),
      ]),
      [
        'gdbots:pbj.tests:mixin:many:v1',
        'gdbots:pbj.tests:mixin:many',
      ],
    );
  }
}

SampleTraitV1(SampleOtherMessageV1);
MessageResolver.registerMessage('gdbots:pbj.tests::sample-other-message:v1', SampleOtherMessageV1);
Object.freeze(SampleOtherMessageV1);
Object.freeze(SampleOtherMessageV1.prototype);
