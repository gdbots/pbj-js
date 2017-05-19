import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import mediumTextType from '../../src/Type/mediumTextType';
import * as helpers from './helpers';

test('mediumTextType property tests', (assert) => {
  assert.true(mediumTextType instanceof Type);
  assert.same(mediumTextType.getTypeName(), TypeName.MEDIUM_TEXT);
  assert.same(mediumTextType.getTypeValue(), TypeName.MEDIUM_TEXT.valueOf());
  assert.same(mediumTextType.isScalar(), true);
  assert.same(mediumTextType.encodesToScalar(), true);
  assert.same(mediumTextType.getDefault(), null);
  assert.same(mediumTextType.isBoolean(), false);
  assert.same(mediumTextType.isBinary(), false);
  assert.same(mediumTextType.isNumeric(), false);
  assert.same(mediumTextType.isString(), true);
  assert.same(mediumTextType.isMessage(), false);
  assert.same(mediumTextType.allowedInSet(), false);

  try {
    mediumTextType.test = 1;
    assert.fail('mediumTextType instance is mutable');
  } catch (e) {
    assert.pass('mediumTextType instance is immutable');
  }

  assert.end();
});


test('mediumTextType guard tests', (assert) => {
  const field = new Field({ name: 'test', type: mediumTextType });
  const largeText = 'a'.repeat(mediumTextType.getMaxBytes());
  const valid = ['test', largeText, '(╯°□°)╯︵ ┻━┻', ' ice 🍦 poop 💩 doh 😳 ', 'ಠ_ಠ'];
  const invalid = [-1, 1, `${largeText}b`, true, false, null, [], {}, NaN, undefined];
  helpers.guardValidSamples(field, valid, assert);
  helpers.guardInvalidSamples(field, invalid, assert);
  assert.end();
});


test('mediumTextType encode tests', (assert) => {
  const field = new Field({ name: 'test', type: mediumTextType });
  const largeText = 'a'.repeat(mediumTextType.getMaxBytes());
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


test('mediumTextType decode tests', (assert) => {
  const field = new Field({ name: 'test', type: mediumTextType });
  const largeText = 'a'.repeat(mediumTextType.getMaxBytes());
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
