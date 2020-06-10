import test from 'tape';
import FieldAlreadyDefined from '../src/exceptions/FieldAlreadyDefined';
import FieldNotDefined from '../src/exceptions/FieldNotDefined';
import FieldOverrideNotCompatible from '../src/exceptions/FieldOverrideNotCompatible';
import Fb from '../src/FieldBuilder';
import Schema from '../src/Schema';
import SchemaId from '../src/SchemaId';
import T from '../src/types';
// import TypeName from '../src/enums/TypeName';
import SampleMessageV1 from './fixtures/SampleMessageV1';
import SampleMixinV1 from './fixtures/SampleMixinV1';

test('Schema tests', (t) => {
  const schema = SampleMessageV1.schema();

  t.true(schema instanceof Schema, 'schema MUST be an instanceOf Schema');
  t.true(schema.getId() === SchemaId.fromString('pbj:gdbots:pbj.tests::sample-message:1-0-0'));
  t.same(`${schema}`, schema.getId().toString());
  t.same(`${schema.getCurie()}`, 'gdbots:pbj.tests::sample-message');
  t.same(`${schema.getCurieMajor()}`, 'gdbots:pbj.tests::sample-message:v1');
  t.same(`${schema.getQName()}`, 'gdbots:sample-message');
  t.same(schema.getFields().length, 19, 'schema should have 19 fields');
  t.same(schema.getClassName(), 'SampleMessageV1');
  t.same(schema.getHandlerMethodName(), 'sampleMessageV1');
  t.same(schema.getHandlerMethodName(false), 'sampleMessage');
  t.same(schema.getHandlerMethodName(true, 'on'), 'onSampleMessageV1');
  t.same(schema.getHandlerMethodName(false, 'on'), 'onSampleMessage');
  t.true(schema.hasMixin('gdbots:pbj.tests:mixin:many:v1'));
  t.true(schema.hasMixin('gdbots:pbj.tests:mixin:many'));
  t.same(schema.getMixins(), ['gdbots:pbj.tests:mixin:many:v1', 'gdbots:pbj.tests:mixin:many']);
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
    SampleMixinV1.getFields().concat([Fb.create('mixin_string', T.StringType.create()).withDefault('homer').build()]),
  );

  const fields = schema.getFields();
  t.same(fields[0].getName(), '_schema');
  t.same(fields[1].getName(), 'mixin_string');
  t.same(fields[2].getName(), 'mixin_int');
  t.same(schema.getField('mixin_string').getDefault(), 'homer');

  try {
    schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
      SampleMixinV1.getFields().concat([Fb.create('mixin_string', T.IntType.create()).build()]),
    );
    t.fail('schema allowed invalid override (type mismatch)');
  } catch (e) {
    t.true(e instanceof FieldOverrideNotCompatible, 'Exception MUST be an instanceOf FieldOverrideNotCompatible');
    t.pass(e.message);
  }

  try {
    schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
      SampleMixinV1.getFields().concat([Fb.create('mixin_string', T.StringType.create()).required().build()]),
    );
    t.fail('schema allowed invalid override (original optional, override required)');
  } catch (e) {
    t.true(e instanceof FieldOverrideNotCompatible, 'Exception MUST be an instanceOf FieldOverrideNotCompatible');
    t.pass(e.message);
  }

  try {
    schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
      SampleMixinV1.getFields().concat([Fb.create('mixin_string', T.StringType.create()).asAMap().build()]),
    );
    t.fail('schema allowed invalid override (original single, override map)');
  } catch (e) {
    t.true(e instanceof FieldOverrideNotCompatible, 'Exception MUST be an instanceOf FieldOverrideNotCompatible');
    t.pass(e.message);
  }

  try {
    schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1,
      SampleMixinV1.getFields().concat([Fb.create('mixin_int', T.IntType.create()).build()]),
    );
    t.fail('schema allowed invalid override (not overridable)');
  } catch (e) {
    t.true(e instanceof FieldAlreadyDefined, 'Exception MUST be an instanceOf FieldAlreadyDefined');
    t.pass(e.message);
  }

  t.end();
});


test('Schema mixin tests', (t) => {
  const schema = new Schema('pbj:gdbots:pbj.tests::sample-message:1-0-0', SampleMessageV1, [],
    [
      'gdbots:pbj.tests:mixin:one:v1',
      'gdbots:pbj.tests:mixin:one'
    ],
  );

  t.true(schema.hasMixin('gdbots:pbj.tests:mixin:one:v1'));
  t.true(schema.hasMixin('gdbots:pbj.tests:mixin:one'));
  t.false(schema.hasMixin('invalid_mixin'));

  t.end();
});
