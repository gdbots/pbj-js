import test from 'tape';
import SchemaCurie from '../src/SchemaCurie.js';
import SchemaId from '../src/SchemaId.js';
import SchemaQName from '../src/SchemaQName.js';
import InvalidSchemaQName from '../src/exceptions/InvalidSchemaQName.js';

test('SchemaQName tests', (t) => {
  const valid = ['acme:article', 'youtube:video', 'acme-widgets:widget-thing'];
  valid.forEach((qname) => {
    try {
      const [vendor, message] = qname.split(':');
      const schemaQName = SchemaQName.fromString(qname);
      const schemaQName2 = new SchemaQName(vendor, message);
      t.same(`${schemaQName}`, `${schemaQName2}`);
      t.true(schemaQName instanceof SchemaQName, 'schemaQName MUST be an instanceOf SchemaQName');
      t.same(schemaQName.toString(), qname);
      t.same(schemaQName.valueOf(), qname);
      t.same(schemaQName.toJSON(), qname);
      t.same(`${schemaQName}`, qname);
      t.same(JSON.stringify(schemaQName), `"${qname}"`);
      t.same(schemaQName.getVendor(), vendor);
      t.same(schemaQName.getMessage(), message);

      try {
        schemaQName.test = 1;
        t.fail('schemaQName instance is mutable');
      } catch (e) {
        t.pass('schemaQName instance is immutable');
      }
    } catch (e) {
      t.fail(e.message);
    }
  });

  const invalid = [
    'Not A qname',
    'acme.widgets:widget',
    ' acme:widget ',
    ':',
    ' : ',
    ' ',
    1,
    0,
    '',
    null,
    false,
    true,
    {},
    [],
    NaN,
  ];
  invalid.forEach((qname) => {
    try {
      const schemaQName = SchemaQName.fromString(qname);
      t.fail(`SchemaQName [${schemaQName}] created with invalid value [${JSON.stringify(qname)}].`);
    } catch (e) {
      t.true(e instanceof InvalidSchemaQName, 'Exception MUST be an instanceOf InvalidSchemaQName');
      t.pass(e.message);
    }
  });

  t.end();
});


test('SchemaQName instance tests', (t) => {
  const instance1 = SchemaQName.fromString('acme:article');
  const instance2 = SchemaQName.fromString('acme:article');
  t.same(instance1, instance2);

  try {
    instance1.test = 1;
    t.fail('SchemaQName instance1 is mutable');
  } catch (e) {
    t.pass('SchemaQName instance1 is immutable');
  }

  try {
    instance2.test = 1;
    t.fail('SchemaQName instance2 is mutable');
  } catch (e) {
    t.pass('SchemaQName instance2 is immutable');
  }

  t.end();
});


test('SchemaQName fromCurie tests', (t) => {
  const curie = SchemaCurie.fromString('acme:blog:node:article');
  const qname = SchemaQName.fromCurie(curie);
  t.same(qname.toString(), 'acme:article');
  t.end();
});


test('SchemaQName fromId tests', (t) => {
  const qname = SchemaQName.fromId(SchemaId.fromString('pbj:acme:blog:node:article:1-2-3'));
  t.same(qname.toString(), 'acme:article');
  t.end();
});
