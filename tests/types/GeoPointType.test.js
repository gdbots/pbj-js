import test from 'tape';
import TypeName from '../../src/enums/TypeName.js';
import Type from '../../src/types/Type.js';
import Field from '../../src/Field.js';
import GeoPointType from '../../src/types/GeoPointType.js';
import GeoPoint from '../../src/well-known/GeoPoint.js';
import helpers from './helpers.js';

test('GeoPointType property tests', (t) => {
  const geoPointType = GeoPointType.create();
  t.true(geoPointType instanceof Type);
  t.true(geoPointType instanceof GeoPointType);
  t.same(geoPointType, GeoPointType.create());
  t.true(geoPointType === GeoPointType.create());
  t.same(geoPointType.getTypeName(), TypeName.GEO_POINT);
  t.same(geoPointType.getTypeValue(), TypeName.GEO_POINT.valueOf());
  t.same(geoPointType.isScalar(), false);
  t.same(geoPointType.encodesToScalar(), false);
  t.same(geoPointType.getDefault(), null);
  t.same(geoPointType.isBoolean(), false);
  t.same(geoPointType.isBinary(), false);
  t.same(geoPointType.isNumeric(), false);
  t.same(geoPointType.isString(), false);
  t.same(geoPointType.isMessage(), false);
  t.same(geoPointType.allowedInSet(), false);

  try {
    geoPointType.test = 1;
    t.fail('GeoPointType instance is mutable');
  } catch (e) {
    t.pass('GeoPointType instance is immutable');
  }

  t.end();
});


test('GeoPointType guard tests', (t) => {
  const field = new Field({ name: 'test', type: GeoPointType.create() });
  const valid = [
    GeoPoint.fromString('34.1789335,-118.347594'),
    new GeoPoint(34.1789335, -118.347594),
  ];
  const invalid = [
    '34.1789335,-118.347594',
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


test('GeoPointType encode tests', (t) => {
  const field = new Field({ name: 'test', type: GeoPointType.create() });
  const codec = { encodeGeoPoint: value => value.toJSON() };
  const samples = [
    {
      input: GeoPoint.fromString('34.1789335,-118.347594'),
      output: { type: 'Point', coordinates: [-118.347594, 34.1789335] },
    },
    { input: 0, output: null },
    { input: 1, output: null },
    { input: 2, output: null },
    { input: false, output: null },
    { input: '', output: null },
    { input: null, output: null },
    { input: undefined, output: null },
    { input: NaN, output: null },
  ];

  helpers.encodeSamples(field, samples, t, codec);
  t.end();
});


test('GeoPointType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: GeoPointType.create() });
  const codec = { decodeGeoPoint: value => GeoPoint.fromObject(value) };
  const gp = GeoPoint.fromString('34.1789335,-118.347594');
  const samples = [
    {
      input: { type: 'Point', coordinates: [-118.347594, 34.1789335] },
      output: gp,
    },
    { input: gp, output: gp },
    { input: null, output: null },
  ];

  await helpers.decodeSamples(field, samples, t, codec);
  t.end();
});


test('GeoPointType decode(invalid) tests', async (t) => {
  const field = new Field({ name: 'test', type: GeoPointType.create() });
  const codec = { decodeGeoPoint: value => GeoPoint.fromObject(value) };
  const samples = [
    'nope',
    { type: 'Point', coordinates: [-181, 91] },
    false,
    [],
    {},
    '',
    NaN,
    undefined,
  ];
  await helpers.decodeInvalidSamples(field, samples, t, codec);
  t.end();
});
