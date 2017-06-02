/* eslint-disable */

import test from 'tape';
import MessageRef from '../src/MessageRef';
import SchemaCurie from '../src/SchemaCurie';

test('MessageRef tests', (t) => {
  t.end();
  return;
  const valid = [
    'acme:blog:node:article:123#tag',
    'acme:blog::article:123#tag',
    'acme:blog::article:123',
    'acme:blog:node:article:2015/12/25/test#tag',
    'acme:blog:node:article:2015/12/25/test',
    'acme:blog::article:2015/12/25/test#tag',
    'acme:blog::article:2015/12/25/test',
  ];
  valid.forEach((version) => {
    try {
      const [vendor, pkg, category, last] = ref.split(':');
      const [message, tag] = last.split('#');
      //const curie = SchemaCurie
      const ref1 = MessageRef.fromString(version);
      const ref2 = new MessageRef(major, minor, patch);
      t.same(`${ref1}`, `${ref2}`);
      t.true(schemaVersion instanceof SchemaVersion, 'schemaVersion MUST be an instanceOf SchemaVersion');
      t.same(schemaVersion.toString(), version);
      t.same(schemaVersion.valueOf(), version);
      t.same(schemaVersion.toJSON(), version);
      t.same(`${schemaVersion}`, version);
      t.same(JSON.stringify(schemaVersion), `"${version}"`);
      t.same(schemaVersion.getMajor(), major);
      t.same(schemaVersion.getMinor(), minor);
      t.same(schemaVersion.getPatch(), patch);

      try {
        schemaVersion.test = 1;
        t.fail('schemaVersion instance is mutable');
      } catch (e) {
        t.pass('schemaVersion instance is immutable');
      }
    } catch (e) {
      t.fail(e.message);
    }
  });

  const invalid = [
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
    'acme:::#tag',
    null,
    false,
    true,
    {},
    [],
    NaN,
  ];
  invalid.forEach((str) => {
    try {
      const ref = MessageRef.fromString(str);
      t.fail(`MessageRef [${ref}] created with invalid format [${JSON.stringify(str)}].`);
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});
