/* eslint-disable class-methods-use-this */
import Fb from '../../src/FieldBuilder';
import Message from '../../src/Message';
import MessageResolver from '../../src/MessageResolver';
import Schema from '../../src/Schema';
import T from '../../src/types';
import SampleMixinV1 from './SampleMixinV1';
import SampleTraitV1 from './SampleTraitV1';

export default class SampleOtherMessageV1 extends Message {
  /**
   * @private
   *
   * @returns {Schema}
   */
  static defineSchema() {
    return new Schema('pbj:gdbots:pbj.tests::sample-other-message:1-0-0', SampleOtherMessageV1,
      [
        Fb.create('test', T.StringType.create())
          .build(),
      ],
      [
        SampleMixinV1.create(),
      ],
    );
  }
}

SampleTraitV1(SampleOtherMessageV1);
MessageResolver.register('gdbots:pbj.tests::sample-other-message', SampleOtherMessageV1);
