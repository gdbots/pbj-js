import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import TextType from '../../src/Type/TextType';
import * as helpers from './helpers';

test('textType property tests', (t) => {
  const textType = TextType.create();
  t.true(textType instanceof Type);
  t.true(textType instanceof TextType);
  t.same(textType, TextType.create());
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

  try {
    textType.test = 1;
    t.fail('textType instance is mutable');
  } catch (e) {
    t.pass('textType instance is immutable');
  }

  t.end();
});


test('textType guard tests', (t) => {
  const field = new Field({ name: 'test', type: TextType.create() });
  const largeText = 'a'.repeat(field.getType().getMaxBytes());
  const valid = ['test', largeText, '(╯°□°)╯︵ ┻━┻', ' ice 🍦 poop 💩 doh 😳 ', 'ಠ_ಠ'];
  const invalid = [-1, 1, `${largeText}b`, true, false, null, [], {}, NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('textType encode tests', (t) => {
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


test('textType decode tests', (t) => {
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

  helpers.decodeSamples(field, samples, t);
  t.end();
});
