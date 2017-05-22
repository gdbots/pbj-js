import test from 'tape';
import Format from '../../src/Enum/Format';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import StringType from '../../src/Type/StringType';
import * as helpers from './helpers';

test('stringType property tests', (assert) => {
  const stringType = StringType.create();
  assert.true(stringType instanceof Type);
  assert.true(stringType instanceof StringType);
  assert.same(stringType, StringType.create());
  assert.same(stringType.getTypeName(), TypeName.STRING);
  assert.same(stringType.getTypeValue(), TypeName.STRING.valueOf());
  assert.same(stringType.isScalar(), true);
  assert.same(stringType.encodesToScalar(), true);
  assert.same(stringType.getDefault(), null);
  assert.same(stringType.isBoolean(), false);
  assert.same(stringType.isBinary(), false);
  assert.same(stringType.isNumeric(), false);
  assert.same(stringType.isString(), true);
  assert.same(stringType.isMessage(), false);
  assert.same(stringType.allowedInSet(), true);

  try {
    stringType.test = 1;
    assert.fail('stringType instance is mutable');
  } catch (e) {
    assert.pass('stringType instance is immutable');
  }

  assert.end();
});


test('stringType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: StringType.create() });
  const largeText = 'a'.repeat(field.getType().getMaxBytes());
  const valid = ['test', largeText, '(╯°□°)╯︵ ┻━┻', ' ice 🍦 poop 💩 doh 😳 ', 'ಠ_ಠ'];
  const invalid = [-1, 1, `${largeText}b`, true, false, null, [], {}, NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('stringType guard (custom pattern) tests', (assert) => {
  const field = new Field({ name: 'test', type: StringType.create(), pattern: '^\\w+$' });
  const valid = ['AValidValue', 'a_zA_Z0_9', 'all_lower', 'ALL_UPPER'];
  const invalid = ['No spaces, commas, etc.', 'nope!', 'http://www.', '--', '', '#test', 'ಠ_ಠ'];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('stringType guard (format=hashtag) tests', (assert) => {
  const field = new Field({ name: 'test', type: StringType.create(), format: Format.HASHTAG });
  const valid = ['#Hashtag', 'NotherHashtag'];
  const invalid = ['Not A Hashtag', 'nope!', 'http://www.', '111', '_111'];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('stringType encode tests', (assert) => {
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

  helpers.encodeSamples(field, samples, assert);
  assert.end();
});


test('stringType decode tests', (assert) => {
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

  helpers.decodeSamples(field, samples, assert);
  assert.end();
});
