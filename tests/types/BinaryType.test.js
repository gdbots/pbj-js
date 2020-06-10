import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import BinaryType from '../../src/types/BinaryType';
import helpers from './helpers';

test('BinaryType property tests', (t) => {
  const binaryType = BinaryType.create();
  t.true(binaryType instanceof Type);
  t.true(binaryType instanceof BinaryType);
  t.same(binaryType, BinaryType.create());
  t.true(binaryType === BinaryType.create());
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
  t.same(binaryType.getMaxBytes(), 255);

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
  const valid = [
    'test',
    'KOKVr8Kw4pahwrAp4pWv77i1IOKUu+KUgeKUuw==',
    'IGljZSDwn42mIHBvb3Ag8J+SqSBkb2gg8J+YsyA=',
    '4LKgX+CyoA==',
  ];
  const invalid = [-1, 1, true, false, null, [], {}, NaN, undefined];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('BinaryType guard (min/max length) tests', (t) => {
  const binaryType = BinaryType.create();
  binaryType.decodeFromBase64(false);
  binaryType.encodeToBase64(false);

  const field = new Field({ name: 'test', type: binaryType, minLength: 5, maxLength: 10 });
  const valid = ['01234', '0123456789', '012345', '012345678'];
  const invalid = ['0123', '01234567890'];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);

  binaryType.decodeFromBase64(true);
  binaryType.encodeToBase64(true);
  t.end();
});


test('BinaryType encode tests', (t) => {
  const field = new Field({ name: 'test', type: BinaryType.create() });
  const samples = [
    { input: 'test', output: 'dGVzdA==' },
    { input: 'homer simpson', output: 'aG9tZXIgc2ltcHNvbg==' },
    { input: '✓ à la mode', output: '4pyTIMOgIGxhIG1vZGU=' },
    { input: ' ice 🍦 poop 💩 doh 😳 ', output: 'aWNlIPCfjaYgcG9vcCDwn5KpIGRvaCDwn5iz' },
    { input: '(╯°□°)╯︵ ┻━┻', output: 'KOKVr8Kw4pahwrAp4pWv77i1IOKUu+KUgeKUuw==' },
    { input: 'ಠ_ಠ', output: '4LKgX+CyoA==' },
    { input: 'foo © bar 𝌆 baz', output: 'Zm9vIMKpIGJhciDwnYyGIGJheg==' },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('BinaryType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: BinaryType.create() });
  const samples = [
    { input: 'dGVzdA==', output: 'test' },
    { input: 'aG9tZXIgc2ltcHNvbg==', output: 'homer simpson' },
    { input: '4pyTIMOgIGxhIG1vZGU=', output: '✓ à la mode' },
    { input: 'aWNlIPCfjaYgcG9vcCDwn5KpIGRvaCDwn5iz', output: 'ice 🍦 poop 💩 doh 😳' },
    { input: 'KOKVr8Kw4pahwrAp4pWv77i1IOKUu+KUgeKUuw==', output: '(╯°□°)╯︵ ┻━┻' },
    { input: '4LKgX+CyoA==', output: 'ಠ_ಠ' },
    { input: 'Zm9vIMKpIGJhciDwnYyGIGJheg==', output: 'foo © bar 𝌆 baz' },
  ];

  await helpers.decodeSamples(field, samples, t);
  t.end();
});
