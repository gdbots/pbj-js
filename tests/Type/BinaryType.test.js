import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import BinaryType from '../../src/Type/BinaryType';
import * as helpers from './helpers';

test('BinaryType property tests', (t) => {
  const binaryType = BinaryType.create();
  t.true(binaryType instanceof Type);
  t.true(binaryType instanceof BinaryType);
  t.same(binaryType, BinaryType.create());
  t.same(binaryType.getTypeName(), TypeName.BINARY);
  t.same(binaryType.getTypeValue(), TypeName.BINARY.valueOf());
  t.same(binaryType.isScalar(), true);
  t.same(binaryType.encodesToScalar(), true);
  t.same(binaryType.getDefault(), null);
  t.same(binaryType.isBoolean(), false);
  t.same(binaryType.isBinary(), true);
  t.same(binaryType.isNumeric(), false);
  t.same(binaryType.isString(), true);
  t.same(binaryType.isMessage(), false);
  t.same(binaryType.allowedInSet(), true);

  try {
    binaryType.test = 1;
    t.fail('binaryType instance is mutable');
  } catch (e) {
    t.pass('binaryType instance is immutable');
  }

  t.end();
});


test('BinaryType guard tests', (t) => {
  const field = new Field({ name: 'test', type: BinaryType.create() });
  const largeText = 'a'.repeat(field.getType().getMaxBytes());
  const valid = [
    'test',
    largeText,
    'KOKVr8Kw4pahwrAp4pWv77i1IOKUu+KUgeKUuw==',
    'IGljZSDwn42mIHBvb3Ag8J+SqSBkb2gg8J+YsyA=',
    '4LKgX+CyoA==',
  ];
  const invalid = [-1, 1, `${largeText}b`, true, false, null, [], {}, NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('BinaryType encode tests', (t) => {
  const field = new Field({ name: 'test', type: BinaryType.create() });
  const samples = [
    { input: 'test', output: 'dGVzdA==' },
    { input: 'homer simpson', output: 'aG9tZXIgc2ltcHNvbg==' },
    { input: ' ice 🍦 poop 💩 doh 😳 ', output: 'IGljZSDwn42mIHBvb3Ag8J+SqSBkb2gg8J+YsyA=' },
    { input: '(╯°□°)╯︵ ┻━┻', output: 'KOKVr8Kw4pahwrAp4pWv77i1IOKUu+KUgeKUuw==' },
    { input: 'ಠ_ಠ', output: '4LKgX+CyoA==' },
    { input: 'foo © bar 𝌆 baz', output: 'Zm9vIMKpIGJhciDwnYyGIGJheg==' }
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('BinaryType decode tests', (t) => {
  const field = new Field({ name: 'test', type: BinaryType.create() });
  const samples = [
    { input: 'dGVzdA==', output: 'test' },
    { input: 'aG9tZXIgc2ltcHNvbg==', output: 'homer simpson' },
    { input: 'IGljZSDwn42mIHBvb3Ag8J+SqSBkb2gg8J+YsyA=', output: ' ice 🍦 poop 💩 doh 😳 ' },
    { input: 'KOKVr8Kw4pahwrAp4pWv77i1IOKUu+KUgeKUuw==', output: '(╯°□°)╯︵ ┻━┻' },
    { input: '4LKgX+CyoA==', output: 'ಠ_ಠ' },
    { input: 'Zm9vIMKpIGJhciDwnYyGIGJheg==', output: 'foo © bar 𝌆 baz' }
  ];

  helpers.decodeSamples(field, samples, t);
  t.end();
});
