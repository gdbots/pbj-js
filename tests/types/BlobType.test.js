import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import BlobType from '../../src/types/BlobType';
import helpers from './helpers';

test('BlobType property tests', (t) => {
  const blobType = BlobType.create();
  t.true(blobType instanceof Type);
  t.true(blobType instanceof BlobType);
  t.same(blobType, BlobType.create());
  t.true(blobType === BlobType.create());
  t.same(blobType.getTypeName(), TypeName.BLOB);
  t.same(blobType.getTypeValue(), TypeName.BLOB.valueOf());
  t.same(blobType.isScalar(), true);
  t.same(blobType.encodesToScalar(), true);
  t.same(blobType.getDefault(), null);
  t.same(blobType.isBoolean(), false);
  t.same(blobType.isBinary(), true);
  t.same(blobType.isNumeric(), false);
  t.same(blobType.isString(), true);
  t.same(blobType.isMessage(), false);
  t.same(blobType.allowedInSet(), false);
  t.same(blobType.getMaxBytes(), 65535);

  try {
    blobType.test = 1;
    t.fail('blobType instance is mutable');
  } catch (e) {
    t.pass('blobType instance is immutable');
  }

  t.end();
});


test('BlobType guard tests', (t) => {
  const field = new Field({ name: 'test', type: BlobType.create() });
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


test('BlobType guard (min/max length) tests', (t) => {
  const blobType = BlobType.create();
  blobType.decodeFromBase64(false);
  blobType.encodeToBase64(false);

  const field = new Field({ name: 'test', type: blobType, minLength: 5, maxLength: 10 });
  const valid = ['01234', '0123456789', '012345', '012345678'];
  const invalid = ['0123', '01234567890'];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);

  blobType.decodeFromBase64(true);
  blobType.encodeToBase64(true);
  t.end();
});


test('BlobType encode tests', (t) => {
  const field = new Field({ name: 'test', type: BlobType.create() });
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


test('BlobType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: BlobType.create() });
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
