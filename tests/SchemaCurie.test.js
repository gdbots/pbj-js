import test from 'tape';
import SchemaCurie from '../src/SchemaCurie.js';
import SchemaQName from '../src/SchemaQName.js';

test('SchemaCurie tests', (t) => {
  const valid = [
    'acme:blog:node:article',
    'acme:blog::article',
    'acme:blog.v1::article',
    'acme:blog.v1:node:article',
    'acme-widgets:web.v1::article',
    'acme-widgets:web.v1:node:article',
  ];
  valid.forEach((str) => {
    try {
      const [vendor, pkg, category, message] = str.split(':');
      const curie1 = new SchemaCurie(vendor, pkg, category, message);
      const curie2 = SchemaCurie.fromString(str);
      const qname = SchemaQName.fromString(`${vendor}:${message}`);
      t.same(`${curie1}`, `${curie2}`);
      t.true(curie1 instanceof SchemaCurie, 'curie1 MUST be an instanceOf SchemaCurie');
      t.true(curie2 instanceof SchemaCurie, 'curie2 MUST be an instanceOf SchemaCurie');
      t.same(curie1.toString(), str);
      t.same(curie1.valueOf(), str);
      t.same(curie1.toJSON(), str);
      t.same(`${curie1}`, str);
      t.same(JSON.stringify(curie1), `"${str}"`);
      t.same(curie1.getVendor(), vendor);
      t.same(curie1.getPackage(), pkg);
      t.same(curie1.getCategory(), category || null);
      t.same(curie1.getMessage(), message);
      t.true(curie1.equals(curie2));
      t.true(curie2.equals(curie1));
      t.true(curie1 === curie2);
      t.true(curie1.getQName() === qname);
      t.true(curie2.getQName() === qname);

      try {
        curie1.test = 1;
        t.fail('curie1 instance is mutable');
      } catch (e) {
        t.pass('curie1 instance is immutable');
      }
    } catch (e) {
      t.fail(e.message);
    }
  });

  const invalid = [
    `acme:blog:node:article${'x'.repeat(124)}`,
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
    'acme:blog:node:',
    'acme:blog::',
    'acme:::',
    'acme:::',
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
      const curie = SchemaCurie.fromString(str);
      t.fail(`SchemaCurie [${curie}] created with invalid format [${JSON.stringify(str)}].`);
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});
