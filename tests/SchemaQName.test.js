import test from 'tape';
import SchemaQName from '../src/SchemaQName';
import InvalidSchemaQName from '../src/Exception/InvalidSchemaQName';

test('SchemaQName tests', (assert) => {
  const valid = ['acme:article', 'youtube:video', 'acme-widgets:widget-thing'];
  valid.forEach((qname) => {
    try {
      const [vendor, message] = qname.split(':');
      const schemaQName = SchemaQName.fromString(qname);
      const schemaQName2 = new SchemaQName(vendor, message);
      assert.same(`${schemaQName}`, `${schemaQName2}`);
      assert.true(schemaQName instanceof SchemaQName, 'schemaQName MUST be an instanceOf SchemaQName');
      assert.same(schemaQName.toString(), qname);
      assert.same(schemaQName.valueOf(), qname);
      assert.same(schemaQName.toJSON(), qname);
      assert.same(`${schemaQName}`, qname);
      assert.same(JSON.stringify(schemaQName), `"${qname}"`);
      assert.same(schemaQName.getVendor(), vendor);
      assert.same(schemaQName.getMessage(), message);

      try {
        schemaQName.test = 1;
        assert.fail('schemaQName instance is mutable');
      } catch (e) {
        assert.pass('schemaQName instance is immutable');
      }
    } catch (e) {
      assert.fail(e.message);
    }
  });

  const invalid = [
    'Not A qname',
    'acme.widgets:widget',
    'vendor:package:category:message',
    ' acme:widget ',
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
      assert.fail(`SchemaQName [${schemaQName}] created with invalid value [${JSON.stringify(qname)}].`);
    } catch (e) {
      assert.true(e instanceof InvalidSchemaQName, 'Exception MUST be an instanceOf InvalidschemaQName');
      assert.pass(e.message);
    }
  });

  assert.end();
});


test('SchemaQName instance tests', (assert) => {
  const instance1 = SchemaQName.fromString('acme:article');
  const instance2 = SchemaQName.fromString('acme:article');
  assert.same(instance1, instance2);

  try {
    instance1.test = 1;
    assert.fail('SchemaQName instance1 is mutable');
  } catch (e) {
    assert.pass('SchemaQName instance1 is immutable');
  }

  try {
    instance2.test = 1;
    assert.fail('SchemaQName instance2 is mutable');
  } catch (e) {
    assert.pass('SchemaQName instance2 is immutable');
  }

  assert.end();
});


test('SchemaQName fromCurie tests', (assert) => {
  assert.fail('todo: write these tests');
  assert.end();
});


test('SchemaQName fromId tests', (assert) => {
  assert.fail('todo: write these tests');
  assert.end();
});
