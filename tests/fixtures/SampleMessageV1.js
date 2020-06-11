import Fb from '../../src/FieldBuilder';
import Message from '../../src/Message';
import MessageResolver from '../../src/MessageResolver';
import Schema from '../../src/Schema';
import T from '../../src/types';
import SampleMixinV1 from './SampleMixinV1';
import SampleTraitV1 from './SampleTraitV1';

export default class SampleMessageV1 extends Message {
  /**
   * @private
   *
   * @returns {Schema}
   */
  static defineSchema() {
    return new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
      SampleMixinV1.getFields().concat([
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

        Fb.create('message_single', T.MessageType.create())
          .anyOfCuries(['gdbots:pbj.tests::sample-other-message'])
          .build(),
        Fb.create('message_list', T.MessageType.create())
          .asAList()
          .anyOfCuries(['gdbots:pbj.tests::sample-other-message'])
          .build(),
        Fb.create('message_map', T.MessageType.create())
          .asAMap()
          .anyOfCuries(['gdbots:pbj.tests::sample-other-message'])
          .build(),

        Fb.create('message_ref_single', T.MessageRefType.create())
          .build(),
        Fb.create('message_ref_list', T.MessageRefType.create())
          .asAList()
          .build(),
        Fb.create('message_ref_map', T.MessageRefType.create())
          .asAMap()
          .build(),

        Fb.create('node_ref_single', T.NodeRefType.create())
          .build(),
        Fb.create('node_ref_set', T.NodeRefType.create())
          .asASet()
          .build(),
        Fb.create('node_ref_list', T.NodeRefType.create())
          .asAList()
          .build(),
        Fb.create('node_ref_map', T.NodeRefType.create())
          .asAMap()
          .build(),

        Fb.create('geo_point_single', T.GeoPointType.create())
          .build(),
        Fb.create('geo_point_list', T.GeoPointType.create())
          .asAList()
          .build(),
        Fb.create('geo_point_map', T.GeoPointType.create())
          .asAMap()
          .build(),

        Fb.create('dynamic_field_single', T.DynamicFieldType.create())
          .build(),
        Fb.create('dynamic_field_list', T.DynamicFieldType.create())
          .asAList()
          .build(),
        Fb.create('dynamic_field_map', T.DynamicFieldType.create())
          .asAMap()
          .build(),
      ]),
      [
        'gdbots:pbj.tests:mixin:many:v1',
        'gdbots:pbj.tests:mixin:many',
      ],
    );
  }
}

SampleTraitV1(SampleMessageV1);
MessageResolver.registerMessage('gdbots:pbj.tests::sample-message:v1', SampleMessageV1);
Object.freeze(SampleMessageV1);
Object.freeze(SampleMessageV1.prototype);
