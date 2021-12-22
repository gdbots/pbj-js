import test from 'tape';
import SchemaId from '../src/SchemaId.js';
import SchemaCurie from '../src/SchemaCurie.js';
import SchemaQName from '../src/SchemaQName.js';

test('SchemaId tests', (t) => {
  const valid = [
    'pbj:acme:blog:node:article:1-2-3',
    'pbj:acme:blog::article:1-2-3',
    'pbj:acme:blog.v1::article:1-2-3',
    'pbj:acme:blog.v1:node:article:1-2-3',
    'pbj:acme-widgets:web.v1::article:1-2-3',
    'pbj:acme-widgets:web.v1:node:article:1-2-3',
  ];
  valid.forEach((str) => {
    try {
      const [vendor, pkg, category, message, version] = str.substr(4).split(':');
      const id1 = new SchemaId(vendor, pkg, category, message, version);
      const id2 = SchemaId.fromString(str);
      const curie = SchemaCurie.fromString(`${vendor}:${pkg}:${category}:${message}`);
      const qname = SchemaQName.fromString(`${vendor}:${message}`);

      t.same(`${id1}`, `${id2}`);
      t.true(id1 instanceof SchemaId, 'id1 MUST be an instanceOf SchemaId');
      t.true(id2 instanceof SchemaId, 'id2 MUST be an instanceOf SchemaId');
      t.same(id1.toString(), str);
      t.same(id1.valueOf(), str);
      t.same(id1.toJSON(), str);
      t.same(`${id1}`, str);
      t.same(JSON.stringify(id1), `"${str}"`);

      t.same(id1.getVendor(), vendor);
      t.same(id1.getPackage(), pkg);
      t.same(id1.getCategory(), category || null);
      t.same(id1.getMessage(), message);
      t.true(id1.getCurie() === curie);
      t.true(id1.getQName() === qname);
      t.same(id1.getVersion().toString(), version);
      t.same(id1.getCurieMajor(), `${curie}:v${id1.getVersion().getMajor()}`);

      t.true(id1.equals(id2));
      t.true(id2.equals(id1));
      t.true(id1 === id2);

      try {
        id1.test = 1;
        t.fail('id1 instance is mutable');
      } catch (e) {
        t.pass('id1 instance is immutable');
      }
    } catch (e) {
      t.fail(e.message);
    }
  });

  const invalid = [
    `pbj:acme:blog:node:article${'x'.repeat(124)}:1-2-3`,
    'test::what',
    'test::',
    'test:::',
    ':test',
    'john@doe.com',
    '#hashtag',
    'http://www.what.com/',
    'test.value:2015/01/01/test:what',
    'cool~topic',
    'some:thin!@##$%$%&^^&**()-=+',
    'some:test%20',
    'ACME:blog:node:article:1:2:3:4#tag',
    'ACME:blog:node:article#tag',
    'ACME:blog:node:',
    'ACME:blog::',
    'ACME:::',
    'pbj:acme:blog:node:',
    'pbj:acme:blog::',
    'pbj:acme:::',
    'pbj:acme:::',
    ' : ',
    ' : : : ',
    ':',
    null,
    false,
    true,
    {},
    [],
    NaN,
  ];
  invalid.forEach((str) => {
    try {
      const id = SchemaId.fromString(str);
      t.fail(`SchemaId [${id}] created with invalid format [${JSON.stringify(str)}].`);
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});
