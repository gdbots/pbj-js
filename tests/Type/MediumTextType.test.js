import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import MediumTextType from '../../src/Type/MediumTextType';
import * as helpers from './helpers';

test('MediumTextType property tests', (t) => {
  const mediumTextType = MediumTextType.create();
  t.true(mediumTextType instanceof Type);
  t.true(mediumTextType instanceof MediumTextType);
  t.same(mediumTextType, MediumTextType.create());
  t.same(mediumTextType.getTypeName(), TypeName.MEDIUM_TEXT);
  t.same(mediumTextType.getTypeValue(), TypeName.MEDIUM_TEXT.valueOf());
  t.same(mediumTextType.isScalar(), true);
  t.same(mediumTextType.encodesToScalar(), true);
  t.same(mediumTextType.getDefault(), null);
  t.same(mediumTextType.isBoolean(), false);
  t.same(mediumTextType.isBinary(), false);
  t.same(mediumTextType.isNumeric(), false);
  t.same(mediumTextType.isString(), true);
  t.same(mediumTextType.isMessage(), false);
  t.same(mediumTextType.allowedInSet(), false);

  try {
    mediumTextType.test = 1;
    t.fail('mediumTextType instance is mutable');
  } catch (e) {
    t.pass('mediumTextType instance is immutable');
  }

  t.end();
});


test('MediumTextType guard tests', (t) => {
  const field = new Field({ name: 'test', type: MediumTextType.create() });
  const largeText = 'a'.repeat(field.getType().getMaxBytes());
  const valid = ['test', largeText, '(╯°□°)╯︵ ┻━┻', ' ice 🍦 poop 💩 doh 😳 ', 'ಠ_ಠ'];
  const invalid = [-1, 1, `${largeText}b`, true, false, null, [], {}, NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('MediumTextType encode tests', (t) => {
  const field = new Field({ name: 'test', type: MediumTextType.create() });
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


test('MediumTextType decode tests', (t) => {
  const field = new Field({ name: 'test', type: MediumTextType.create() });
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
