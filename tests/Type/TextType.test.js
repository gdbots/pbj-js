import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import TextType from '../../src/Type/TextType';
import * as helpers from './helpers';

test('textType property tests', (assert) => {
  const textType = TextType.create();
  assert.true(textType instanceof Type);
  assert.true(textType instanceof TextType);
  assert.same(textType, TextType.create());
  assert.same(textType.getTypeName(), TypeName.TEXT);
  assert.same(textType.getTypeValue(), TypeName.TEXT.valueOf());
  assert.same(textType.isScalar(), true);
  assert.same(textType.encodesToScalar(), true);
  assert.same(textType.getDefault(), null);
  assert.same(textType.isBoolean(), false);
  assert.same(textType.isBinary(), false);
  assert.same(textType.isNumeric(), false);
  assert.same(textType.isString(), true);
  assert.same(textType.isMessage(), false);
  assert.same(textType.allowedInSet(), false);

  try {
    textType.test = 1;
    assert.fail('textType instance is mutable');
  } catch (e) {
    assert.pass('textType instance is immutable');
  }

  assert.end();
});


test('textType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: TextType.create() });
  const largeText = 'a'.repeat(field.getType().getMaxBytes());
  const valid = ['test', largeText, '(╯°□°)╯︵ ┻━┻', ' ice 🍦 poop 💩 doh 😳 ', 'ಠ_ಠ'];
  const invalid = [-1, 1, `${largeText}b`, true, false, null, [], {}, NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('textType encode tests', (assert) => {
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

  helpers.encodeSamples(field, samples, assert);
  assert.end();
});


test('textType decode tests', (assert) => {
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

  helpers.decodeSamples(field, samples, assert);
  assert.end();
});
