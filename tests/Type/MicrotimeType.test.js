import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import MicrotimeType from '../../src/Type/MicrotimeType';
import Microtime from '../../src/WellKnown/Microtime';
import * as helpers from './helpers';

test('MicrotimeType property tests', (t) => {
  const microtimeType = MicrotimeType.create();
  t.true(microtimeType instanceof Type);
  t.true(microtimeType instanceof MicrotimeType);
  t.same(microtimeType, MicrotimeType.create());
  t.same(microtimeType.getTypeName(), TypeName.MICROTIME);
  t.same(microtimeType.getTypeValue(), TypeName.MICROTIME.valueOf());
  t.same(microtimeType.isScalar(), false);
  t.same(microtimeType.encodesToScalar(), true);
  t.true(microtimeType.getDefault() instanceof Microtime);
  t.same(microtimeType.isBoolean(), false);
  t.same(microtimeType.isBinary(), false);
  t.same(microtimeType.isNumeric(), true);
  t.same(microtimeType.isString(), false);
  t.same(microtimeType.isMessage(), false);
  t.same(microtimeType.allowedInSet(), true);

  try {
    microtimeType.test = 1;
    t.fail('MicrotimeType instance is mutable');
  } catch (e) {
    t.pass('MicrotimeType instance is immutable');
  }

  t.end();
});


test('MicrotimeType guard tests', (t) => {
  const field = new Field({ name: 'test', type: MicrotimeType.create() });
  const valid = [
    Microtime.create(),
    Microtime.fromString('1495766080123456'),
    new Microtime('1495766080123456'),
  ];
  const invalid = [
    '1495766080123456',
    null,
    [],
    {},
    '',
    NaN,
    undefined,
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('MicrotimeType encode tests', (t) => {
  const field = new Field({ name: 'test', type: MicrotimeType.create() });
  const mtime = Microtime.create();
  const samples = [
    {
      input: Microtime.fromString('1495766080123456'),
      output: '1495766080123456',
    },
    { input: mtime, output: mtime.toString() },
    { input: 0, output: null },
    { input: 1, output: null },
    { input: 2, output: null },
    { input: false, output: null },
    { input: '', output: null },
    { input: null, output: null },
    { input: undefined, output: null },
    { input: NaN, output: null },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('MicrotimeType decode tests', (t) => {
  const field = new Field({ name: 'test', type: MicrotimeType.create() });
  const mtime = Microtime.create();
  const samples = [
    {
      input: '1495766080123456',
      output: Microtime.fromString('1495766080123456'),
    },
    { input: mtime.toString(), output: mtime },
    { input: mtime, output: mtime },
    { input: null, output: null },
  ];

  helpers.decodeSamples(field, samples, t);
  t.end();
});


test('MicrotimeType decode(invalid) tests', (t) => {
  const field = new Field({ name: 'test', type: MicrotimeType.create() });
  const samples = ['nope', '1495766080', false, [], {}, '', NaN, undefined];
  helpers.decodeInvalidSamples(field, samples, t);
  t.end();
});
