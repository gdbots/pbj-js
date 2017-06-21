/* eslint-disable class-methods-use-this */
import Fb from '../../src/FieldBuilder';
import Message from '../../src/Message';
import SchemaResolver from '../../src/SchemaResolver';
import Schema from '../../src/Schema';
import T from '../../src/Type';
import SampleMixinV1 from './SampleMixinV1';
import SampleTraitV1 from './SampleTraitV1';

export default class SampleOtherMessageV1 extends Message {
  /**
   * @private
   *
   * @returns {Schema}
   */
  static defineSchema() {
    const schema = new Schema('pbj:gdbots:pbj.tests::sample-other-message:1-0-0', SampleOtherMessageV1,
      [
        Fb.create('test', T.StringType.create())
          .build(),
      ],
      [
        SampleMixinV1.create(),
      ],
    );

    SchemaResolver.registerSchema(schema);
    return schema;
  }
}

SampleTraitV1(SampleOtherMessageV1);
