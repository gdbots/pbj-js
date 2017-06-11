import test from 'tape';
import FieldAlreadyDefined from '../src/Exception/FieldAlreadyDefined';
import FieldNotDefined from '../src/Exception/FieldNotDefined';
import FieldOverrideNotCompatible from '../src/Exception/FieldOverrideNotCompatible';
import MixinAlreadyAdded from '../src/Exception/MixinAlreadyAdded';
import MixinNotDefined from '../src/Exception/MixinNotDefined';
import Fb from '../src/FieldBuilder';
import Schema from '../src/Schema';
import SchemaId from '../src/SchemaId';
import * as T from '../src/Type';
// import TypeName from '../src/Enum/TypeName';
import SampleMessageV1 from './Fixtures/SampleMessageV1';
import SampleMixinV1 from './Fixtures/SampleMixinV1';
import SampleMixinV2 from './Fixtures/SampleMixinV2';

test('Schema tests', (t) => {
  const schema = SampleMessageV1.schema();
  const mixinId = SampleMixinV1.create().getId();

  t.true(schema instanceof Schema, 'schema MUST be an instanceOf Schema');
  t.true(schema.getId() === SchemaId.fromString('pbj:gdbots:pbj.tests::sample-message:1-0-0'));
  t.same(`${schema}`, schema.getId().toString());
  t.same(`${schema.getCurie()}`, 'gdbots:pbj.tests::sample-message');
  t.same(`${schema.getCurieMajor()}`, 'gdbots:pbj.tests::sample-message:v1');
  t.same(`${schema.getQName()}`, 'gdbots:sample-message');
  t.same(schema.getFields().length, 7, 'schema should have 7 fields');
  t.same(schema.getClassName(), 'SampleMessageV1');
  t.same(schema.getHandlerMethodName(), 'sampleMessage');
  t.same(schema.getHandlerMethodName(true), 'sampleMessageV1');
  t.true(schema.hasMixin(mixinId.getCurieMajor()));
  t.true(schema.getMixin(mixinId.getCurieMajor()), SampleMixinV1.create());
  t.true(schema.hasMixin(mixinId.getCurie().toString()));
  t.true(schema.getMixin(mixinId.getCurie().toString()), SampleMixinV1.create());
  t.same(schema.getMixins(), [SampleMixinV1.create()]);
  t.same(schema.getMixinIds(), [mixinId.getCurieMajor()]);
  t.same(schema.getMixinCuries(), [mixinId.getCurie().toString()]);
  t.same(schema.getRequiredFields()[0].getName(), '_schema');

  // TypeName.getKeys()
  ['string'].forEach((typeName) => {
    ['single', 'set', 'list', 'map'].forEach((rule) => {
      const fieldName = `${typeName.toLowerCase()}_${rule}`;

      if (rule === 'set' && !schema.hasField(fieldName)) {
        return;
      }

      t.true(schema.hasField(fieldName), `schema MUST have field [${fieldName}]`);
      t.same(schema.getField(fieldName).getType().getTypeName().getName(), typeName.toUpperCase());
    });
  });

  try {
    schema.getField('invalid_field');
    t.fail('schema.getField("invalid_field") should have thrown FieldNotDefined');
  } catch (e) {
    t.true(e instanceof FieldNotDefined, 'Exception MUST be an instanceOf FieldNotDefined');
    t.pass(e.message);
  }

  try {
    schema.test = 1;
    t.fail('schema instance is mutable');
  } catch (e) {
    t.pass('schema instance is immutable');
  }

  t.end();
});


test('Schema overridable tests', (t) => {
  let schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
    [Fb.create('mixin_string', T.StringType.create()).withDefault('homer').build()],
    [SampleMixinV1.create()],
  );

  const fields = schema.getFields();
  t.same(fields[0].getName(), '_schema');
  t.same(fields[1].getName(), 'mixin_string');
  t.same(fields[2].getName(), 'mixin_int');
  t.same(schema.getField('mixin_string').getDefault(), 'homer');

  try {
    schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
      [Fb.create('mixin_string', T.IntType.create()).build()],
      [SampleMixinV1.create()],
    );
    t.fail('schema allowed invalid override (type mismatch)');
  } catch (e) {
    t.true(e instanceof FieldOverrideNotCompatible, 'Exception MUST be an instanceOf FieldOverrideNotCompatible');
    t.pass(e.message);
  }

  try {
    schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
      [Fb.create('mixin_string', T.StringType.create()).required().build()],
      [SampleMixinV1.create()],
    );
    t.fail('schema allowed invalid override (original optional, override required)');
  } catch (e) {
    t.true(e instanceof FieldOverrideNotCompatible, 'Exception MUST be an instanceOf FieldOverrideNotCompatible');
    t.pass(e.message);
  }

  try {
    schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
      [Fb.create('mixin_string', T.StringType.create()).asAMap().build()],
      [SampleMixinV1.create()],
    );
    t.fail('schema allowed invalid override (original single, override map)');
  } catch (e) {
    t.true(e instanceof FieldOverrideNotCompatible, 'Exception MUST be an instanceOf FieldOverrideNotCompatible');
    t.pass(e.message);
  }

  try {
    schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
      [Fb.create('mixin_int', T.IntType.create()).build()],
      [SampleMixinV1.create()],
    );
    t.fail('schema allowed invalid override (not overridable)');
  } catch (e) {
    t.true(e instanceof FieldAlreadyDefined, 'Exception MUST be an instanceOf FieldAlreadyDefined');
    t.pass(e.message);
  }

  t.end();
});


test('Schema mixin tests', (t) => {
  let schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1, [],
    [SampleMixinV1.create()],
  );

  try {
    schema.getMixin('invalid_mixin');
    t.fail('schema.getMixin("invalid_mixin") should have thrown MixinNotDefined');
  } catch (e) {
    t.true(e instanceof MixinNotDefined, 'Exception MUST be an instanceOf MixinNotDefined');
    t.pass(e.message);
  }

  try {
    schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1, [],
      [
        SampleMixinV1.create(),
        SampleMixinV1.create(),
      ],
    );
    t.fail('schema allowed same mixin twice');
  } catch (e) {
    t.true(e instanceof MixinAlreadyAdded, 'Exception MUST be an instanceOf MixinAlreadyAdded');
    t.pass(e.message);
  }

  try {
    schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1, [],
      [
        SampleMixinV1.create(),
        SampleMixinV2.create(),
      ],
    );
    t.fail('schema allowed same mixin (by curie) twice');
  } catch (e) {
    t.true(e instanceof MixinAlreadyAdded, 'Exception MUST be an instanceOf MixinAlreadyAdded');
    t.pass(e.message);
  }

  t.end();
});

