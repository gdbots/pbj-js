import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import TextType from '../../src/types/TextType';
import helpers from './helpers';
import Format from '../../src/enums/Format';

test('TextType property tests', (t) => {
  const textType = TextType.create();
  t.true(textType instanceof Type);
  t.true(textType instanceof TextType);
  t.same(textType, TextType.create());
  t.true(textType === TextType.create());
  t.same(textType.getTypeName(), TypeName.TEXT);
  t.same(textType.getTypeValue(), TypeName.TEXT.valueOf());
  t.same(textType.isScalar(), true);
  t.same(textType.encodesToScalar(), true);
  t.same(textType.getDefault(), null);
  t.same(textType.isBoolean(), false);
  t.same(textType.isBinary(), false);
  t.same(textType.isNumeric(), false);
  t.same(textType.isString(), true);
  t.same(textType.isMessage(), false);
  t.same(textType.allowedInSet(), false);
  t.same(textType.getMaxBytes(), 65535);

  try {
    textType.test = 1;
    t.fail('TextType instance is mutable');
  } catch (e) {
    t.pass('TextType instance is immutable');
  }

  t.end();
});


test('TextType guard tests', (t) => {
  const field = new Field({ name: 'test', type: TextType.create() });
  const largeText = 'a'.repeat(field.getType().getMaxBytes());
  const valid = ['test', largeText, '(╯°□°)╯︵ ┻━┻', ' ice 🍦 poop 💩 doh 😳 ', 'ಠ_ಠ'];
  const invalid = [-1, 1, `${largeText}b`, true, false, null, [], {}, NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('TextType guard (format=url) tests', (t) => {
  const field = new Field({ name: 'test', type: TextType.create(), format: Format.URL });
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


test('TextType encode tests', (t) => {
  const field = new Field({ name: 'test', type: TextType.create() });
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


test('TextType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: TextType.create() });
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

  await helpers.decodeSamples(field, samples, t);
  t.end();
});
