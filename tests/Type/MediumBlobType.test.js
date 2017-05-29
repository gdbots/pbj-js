import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import MediumBlobType from '../../src/Type/MediumBlobType';
import * as helpers from './helpers';

test('MediumBlobType property tests', (t) => {
  const mediumBlobType = MediumBlobType.create();
  t.true(mediumBlobType instanceof Type);
  t.true(mediumBlobType instanceof MediumBlobType);
  t.same(mediumBlobType, MediumBlobType.create());
  t.same(mediumBlobType.getTypeName(), TypeName.MEDIUM_BLOB);
  t.same(mediumBlobType.getTypeValue(), TypeName.MEDIUM_BLOB.valueOf());
  t.same(mediumBlobType.isScalar(), true);
  t.same(mediumBlobType.encodesToScalar(), true);
  t.same(mediumBlobType.getDefault(), null);
  t.same(mediumBlobType.isBoolean(), false);
  t.same(mediumBlobType.isBinary(), true);
  t.same(mediumBlobType.isNumeric(), false);
  t.same(mediumBlobType.isString(), true);
  t.same(mediumBlobType.isMessage(), false);
  t.same(mediumBlobType.allowedInSet(), false);
  t.same(mediumBlobType.getMaxBytes(), 16777215);

  try {
    mediumBlobType.test = 1;
    t.fail('mediumBlobType instance is mutable');
  } catch (e) {
    t.pass('mediumBlobType instance is immutable');
  }

  t.end();
});


test('MediumBlobType guard tests', (t) => {
  const field = new Field({ name: 'test', type: MediumBlobType.create() });
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


test('MediumBlobType guard (min/max length) tests', (t) => {
  const mediumBlobType = MediumBlobType.create();
  mediumBlobType.decodeFromBase64(false);
  mediumBlobType.encodeToBase64(false);

  const field = new Field({ name: 'test', type: mediumBlobType, minLength: 5, maxLength: 10 });
  const valid = ['01234', '0123456789', '012345', '012345678'];
  const invalid = ['0123', '01234567890'];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);

  mediumBlobType.decodeFromBase64(true);
  mediumBlobType.encodeToBase64(true);
  t.end();
});


test('MediumBlobType encode tests', (t) => {
  const field = new Field({ name: 'test', type: MediumBlobType.create() });
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


test('MediumBlobType decode tests', (t) => {
  const field = new Field({ name: 'test', type: MediumBlobType.create() });
  const samples = [
    { input: 'dGVzdA==', output: 'test' },
    { input: 'aG9tZXIgc2ltcHNvbg==', output: 'homer simpson' },
    { input: '4pyTIMOgIGxhIG1vZGU=', output: '✓ à la mode' },
    { input: 'aWNlIPCfjaYgcG9vcCDwn5KpIGRvaCDwn5iz', output: 'ice 🍦 poop 💩 doh 😳' },
    { input: 'KOKVr8Kw4pahwrAp4pWv77i1IOKUu+KUgeKUuw==', output: '(╯°□°)╯︵ ┻━┻' },
    { input: '4LKgX+CyoA==', output: 'ಠ_ಠ' },
    { input: 'Zm9vIMKpIGJhciDwnYyGIGJheg==', output: 'foo © bar 𝌆 baz' },
  ];

  helpers.decodeSamples(field, samples, t);
  t.end();
});
