import test from 'tape';
import Format from '../../src/Enum/Format';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import StringType from '../../src/Type/StringType';
import * as helpers from './helpers';

test('StringType property tests', (t) => {
  const stringType = StringType.create();
  t.true(stringType instanceof Type);
  t.true(stringType instanceof StringType);
  t.same(stringType, StringType.create());
  t.same(stringType.getTypeName(), TypeName.STRING);
  t.same(stringType.getTypeValue(), TypeName.STRING.valueOf());
  t.same(stringType.isScalar(), true);
  t.same(stringType.encodesToScalar(), true);
  t.same(stringType.getDefault(), null);
  t.same(stringType.isBoolean(), false);
  t.same(stringType.isBinary(), false);
  t.same(stringType.isNumeric(), false);
  t.same(stringType.isString(), true);
  t.same(stringType.isMessage(), false);
  t.same(stringType.allowedInSet(), true);
  t.same(stringType.getMaxBytes(), 255);

  try {
    stringType.test = 1;
    t.fail('StringType instance is mutable');
  } catch (e) {
    t.pass('StringType instance is immutable');
  }

  t.end();
});


test('StringType guard tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create() });
  const largeText = 'a'.repeat(field.getType().getMaxBytes());
  const valid = ['test', largeText, '(╯°□°)╯︵ ┻━┻', ' ice 🍦 poop 💩 doh 😳 ', 'ಠ_ಠ'];
  const invalid = [-1, 1, `${largeText}b`, true, false, null, [], {}, NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (min/max length) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), minLength: 5, maxLength: 10 });
  const valid = ['01234', '0123456789', '012345', '012345678'];
  const invalid = ['0123', '01234567890'];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (custom pattern) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), pattern: '^\\w+$' });
  const valid = ['AValidValue', 'a_zA_Z0_9', 'all_lower', 'ALL_UPPER'];
  const invalid = ['No spaces, commas, etc.', 'nope!', 'http://www.', '--', '', '#test', 'ಠ_ಠ'];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (format=date) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.DATE });
  const valid = ['2015-12-25', '1999-12-31'];
  const invalid = [
    '01-01-2000',
    'nope!',
    '20151225',
    '2000-1-1',
    '2015/12/25',
    '12/25/2015',
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (format=date-time) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.DATE_TIME });
  const valid = ['2017-05-25T02:54:18Z', '2017-05-25T02:54:18+00:00'];
  const invalid = [
    '01-01-2000',
    'nope!',
    '2000-1-1',
    '2015/12/25',
    '12/25/2015',
    '2017-05-25 23:31:53.197954 Z',
    '2017-05-25T02:54:18a',
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (format=slug) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.SLUG });
  const valid = [
    'slug-case',
    'gCcx85zbxz4',
    'b8ib4r_UqFM',
    '2015/12/25/slug-test',
    '2015/12/25/slug_test',
    '2015-12-25-Slug_Test',
  ];
  const invalid = [
    'Not A Slug',
    'nope!',
    'http://nope.',
    '(╯°□°)╯︵ ┻━┻',
    'ice 🍦 poop 💩 doh 😳',

  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (format=email) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.EMAIL });
  const valid = ['homer@simpsons.com', 'TEST@WHAT.co.uk'];
  const invalid = ['Not An Email', 'nope!', 'http://www.', 'test@what', '@'];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (format=hashtag) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.HASHTAG });
  const valid = ['#Hashtag', 'NotherHashtag'];
  const invalid = ['Not A Hashtag', 'nope!', 'http://www.', '111', '_111'];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (format=ipv4) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.IPV4 });
  const valid = ['192.168.0.10', '4.2.2.2', '10.0.0.0'];
  const invalid = ['Not An IPv4', 'nope!', 'http://www.', '10.1.2.', '10.1.2', '10.1', '.10.1.'];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (format=ipv6) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.IPV6 });
  const valid = ['fe80::6ae3:b5ff:fe92:330e', '2001:0db8:0a0b:12f0:0000:0000:0000:0001'];
  const invalid = [
    'Not An IPv6',
    'nope!',
    'http://www.',
    '192.168.0.10',
    '03:1d:f2:64:6a:01',
    'fe80::35:92ff:fe24:24a3/64',
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (format=hostname) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.HOSTNAME });
  const valid = ['test.com', 'localhost', 'local-dev', 'test.whatever.com'];
  const invalid = [
    'Not A Hostname',
    'nope!',
    '1234',
    '192.168.0.2000',
    'http://www.mydomain.com',
    'www.mydomain.com/page',
    'mydomain.com#page',
    '_domain',
    '*hi*',
    '-hi-',
    ':54:sda54',
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (format=uri) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.URI });
  const valid = [
    'tel:+1-816-555-1212',
    'telnet://192.0.2.16:80/',
    'gdbots:iam:command:create-user',
    'urn:isbn:0451450523',
  ];
  const invalid = [
    'Not A Uri',
    'nope!',
    '1234',
    'http://➡.ws/䨹',
    'http://⌘.ws',
    'http://foo.com/unicode_(✪)_in_parens',
    'http://☺.damowmow.com/',
    'foo',
    'mailto:user@[255:192:168:1]',
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (format=url) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.URL });
  const valid = [
    'http://www.foo.bar./',
    'http://userid:password@example.com:8080',
    'http://userid:password@example.com:8080/',
    'http://userid@example.com',
    'http://userid@example.com/',
    'http://userid@example.com:8080',
    'http://userid@example.com:80',
    'http://userid:password@example.com',
    'http://userid:password@example.com/',
    'http://142.42.1.1/',
    'http://127.0.0.1:8080/',
    'http://foo.com/blah_(wikipedia)#cite-1',
    'http://foo.com/blah_(wikipedia)_blah#cite-1',
    'http://foo.com/(something)?after=parens',
    'http://code.google.com/events/sub/#&product=browser',
    'http://j.mp',
  ];
  const invalid = [
    'Not A Url',
    'nope!',
    '1234',
    'http://⌘.ws',
    'http://foo.com/unicode_(✪)_in_parens',
    'http://☺.damowmow.com/',
    'htt://shouldfailed.com',
    'scheme://shouldfailed.com',
    'emailto:info@example.com',
    'http://##',
    'http://##/',
    'http://foo.bar?q=Spaces should be encoded',
    '//',
    '//a',
    '///a',
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType guard (format=uuid) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.UUID });
  const valid = [
    'e452dd74-41b5-11e7-a919-92ebcb67fe33',
    'd0410f23-75b0-4524-9ce7-2fcc008a7afd',
    '093dc7f7-5915-56a5-87de-033e20310b14',
  ];
  const invalid = [
    'Not A UUID',
    'nope!',
    '1234',
    '11111111-2222-3333-4444-555555556',
    '_xxxxxxxx-yyyy-zzzz-0000-11111111',
    'xxxxxxxx-yyyy-zzzz-0000-11111111_',
    '1111111122223333444455555555',
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('StringType encode tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create() });
  const largeText = 'a'.repeat(field.getType().getMaxBytes());
  const samples = [
    { input: 'hello', output: 'hello' },
    { input: '  hello', output: 'hello' },
    { input: 'hello  ', output: 'hello' },
    { input: '  hello  ', output: 'hello' },
    { input: '    ', output: null },
    { input: largeText, output: largeText },
    { input: '(╯°□°)╯︵ ┻━┻', output: '(╯°□°)╯︵ ┻━┻' },
    { input: 'ಠ_ಠ', output: 'ಠ_ಠ' },
    { input: ' ice 🍦 poop 💩 doh 😳 ', output: 'ice 🍦 poop 💩 doh 😳' },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('StringType decode tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create() });
  const largeText = 'a'.repeat(field.getType().getMaxBytes());
  const samples = [
    { input: 'hello', output: 'hello' },
    { input: '  hello', output: 'hello' },
    { input: 'hello  ', output: 'hello' },
    { input: '  hello  ', output: 'hello' },
    { input: '    ', output: null },
    { input: largeText, output: largeText },
    { input: '(╯°□°)╯︵ ┻━┻', output: '(╯°□°)╯︵ ┻━┻' },
    { input: 'ಠ_ಠ', output: 'ಠ_ಠ' },
    { input: ' ice 🍦 poop 💩 doh 😳 ', output: 'ice 🍦 poop 💩 doh 😳' },
    { input: false, output: 'false' },
    { input: true, output: 'true' },
    { input: '', output: null },
    { input: null, output: null },
    { input: undefined, output: null },
    { input: NaN, output: 'NaN' },
    { input: 3.14, output: '3.14' },
    { input: '3.14', output: '3.14' },
  ];

  helpers.decodeSamples(field, samples, t);
  t.end();
});
