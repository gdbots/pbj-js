import test from 'tape';
import Format from '../../src/Enum/Format';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import StringType from '../../src/Type/StringType';
import * as helpers from './helpers';

test('stringType property tests', (t) => {
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

  try {
    stringType.test = 1;
    t.fail('stringType instance is mutable');
  } catch (e) {
    t.pass('stringType instance is immutable');
  }

  t.end();
});


test('stringType guard tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create() });
  const largeText = 'a'.repeat(field.getType().getMaxBytes());
  const valid = ['test', largeText, '(╯°□°)╯︵ ┻━┻', ' ice 🍦 poop 💩 doh 😳 ', 'ಠ_ಠ'];
  const invalid = [-1, 1, `${largeText}b`, true, false, null, [], {}, NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('stringType guard (custom pattern) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), pattern: '^\\w+$' });
  const valid = ['AValidValue', 'a_zA_Z0_9', 'all_lower', 'ALL_UPPER'];
  const invalid = ['No spaces, commas, etc.', 'nope!', 'http://www.', '--', '', '#test', 'ಠ_ಠ'];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('stringType guard (format=date) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.DATE });
  const valid = ['2015-12-25', '1999-12-31'];
  const invalid = [
    '01-01-2000',
    'nope!',
    new Date(),
    '20151225',
    '2000-1-1',
    '2015/12/25',
    '12/25/2015',
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});

// fixme: finish string guard format tests


test('stringType guard (format=hashtag) tests', (t) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.HASHTAG });
  const valid = ['#Hashtag', 'NotherHashtag'];
  const invalid = ['Not A Hashtag', 'nope!', 'http://www.', '111', '_111'];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('stringType encode tests', (t) => {
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


test('stringType decode tests', (t) => {
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
