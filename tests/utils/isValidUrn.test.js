import test from 'tape';
import isValidUrn from '../../src/utils/isValidUrn';

test('isValidUrn tests', (assert) => {
  const valid = [
    'urn:www-example-org:validator:1',
    'urn:isbn:0451450523',
    'urn:isan:0000-0000-9E59-0000-O-0000-0000-2',
    'urn:ISSN:0167-6423',
    'urn:ietf:rfc:2648',
    'urn:mpeg:mpeg7:schema:2001',
    'urn:oid:2.16.840',
    'urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66',
    'urn:lex:eu:council:directive:2010-03-09;2010-19-UE',
    'urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C',
  ];

  valid.forEach(urn => assert.equal(isValidUrn(urn), true, `urn [${urn}] should be valid.`));

  const invalid = [
    null,
    ' ',
    'foo',
    'www.example.com',
    'https://www.example.com',
    'foo:bar:not:start:with:urn',
    'urn:www.example.org:domain:not:valid',
    ' urn:www-example-org:validator:1',
    'urn:www-example-org:validator:1 ',
    'urn:urn:example-org:validator:1 ',
  ];

  invalid.forEach(urn => assert.equal(isValidUrn(urn), false, `urn [${urn}] should NOT be valid.`));

  assert.end();
});
