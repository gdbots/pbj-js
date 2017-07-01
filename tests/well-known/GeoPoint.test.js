import test from 'tape';
import GeoPoint from '../../src/well-known/GeoPoint';

test('GeoPoint new tests', (t) => {
  const gp = new GeoPoint(0.5, 102.0);
  t.true(gp instanceof GeoPoint);
  t.true(gp.equals(new GeoPoint(gp.getLatitude(), gp.getLongitude())));
  t.true(gp.equals(GeoPoint.fromString(`${gp}`)));
  t.true(gp.equals(GeoPoint.fromJSON(JSON.stringify(gp))));

  t.same(gp.getLatitude(), 0.5);
  t.same(gp.getLongitude(), 102);
  t.same(`${gp.getLatitude()}`, '0.5');
  t.same(`${gp.getLongitude()}`, '102');
  t.same(gp.toString(), '0.5,102');
  t.same(gp.toJSON(), { type: 'Point', coordinates: [102, 0.5] });
  t.same(JSON.stringify(gp), '{"type":"Point","coordinates":[102,0.5]}');

  try {
    gp.test = 1;
    t.fail('gp instance is mutable');
  } catch (e) {
    t.pass('gp instance is immutable');
  }

  t.end();
});


test('GeoPoint fromString tests', (t) => {
  const gp = GeoPoint.fromString('34.1789335,-118.347594');
  t.true(gp instanceof GeoPoint);
  t.true(gp.equals(new GeoPoint(34.1789335, -118.347594)));
  t.true(gp.equals(GeoPoint.fromString(`${gp}`)));
  t.true(gp.equals(GeoPoint.fromJSON(JSON.stringify(gp))));

  t.same(gp.getLatitude(), 34.1789335);
  t.same(gp.getLongitude(), -118.347594);
  t.same(`${gp.getLatitude()}`, '34.1789335');
  t.same(`${gp.getLongitude()}`, '-118.347594');
  t.same(gp.toString(), '34.1789335,-118.347594');
  t.same(gp.toJSON(), { type: 'Point', coordinates: [-118.347594, 34.1789335] });
  t.same(JSON.stringify(gp), '{"type":"Point","coordinates":[-118.347594,34.1789335]}');
  t.end();
});


test('GeoPoint fromJSON tests', (t) => {
  const gp = GeoPoint.fromJSON('{"type":"Point","coordinates":[-118.347594,34.1789335]}');
  t.true(gp instanceof GeoPoint);
  t.true(gp.equals(new GeoPoint(34.1789335, -118.347594)));
  t.true(gp.equals(GeoPoint.fromString(`${gp}`)));
  t.true(gp.equals(GeoPoint.fromJSON(JSON.stringify(gp))));

  t.same(gp.getLatitude(), 34.1789335);
  t.same(gp.getLongitude(), -118.347594);
  t.same(`${gp.getLatitude()}`, '34.1789335');
  t.same(`${gp.getLongitude()}`, '-118.347594');
  t.same(gp.toString(), '34.1789335,-118.347594');
  t.same(gp.toJSON(), { type: 'Point', coordinates: [-118.347594, 34.1789335] });
  t.same(JSON.stringify(gp), '{"type":"Point","coordinates":[-118.347594,34.1789335]}');
  t.end();
});


test('GeoPoint fromJSON(invalid) tests', (t) => {
  const invalid = [
    '[-118.347594,34.1789335]', // not even GeoJson
    '{"type":"Point","coordinates":[34.1789335,-118.347594]}', // wrong order lat/long
    '{"type":"Point","coordinates":[190,-100]}',
    'a,b',
    'nope',
    false,
    [],
    {},
    '',
    NaN,
    undefined,
  ];

  invalid.forEach((value) => {
    try {
      GeoPoint.fromJSON(value);
      t.fail(`GeoPoint.fromJSON accepted invalid value [${JSON.stringify(value)}].`);
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});
