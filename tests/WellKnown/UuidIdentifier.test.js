import test from 'tape';
import Identifier from '../../src/WellKnown/Identifier';
import UuidIdentifier from '../../src/WellKnown/UuidIdentifier';
import SampleUuidIdentifier from '../Fixtures/WellKnown/SampleUuidIdentifier';

test('UuidIdentifier generate tests', (t) => {
  const id = SampleUuidIdentifier.generate();
  t.true(id instanceof Identifier);
  t.true(id instanceof UuidIdentifier);
  t.true(id instanceof SampleUuidIdentifier);
  t.true(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/.test(id));
  t.true(id.equals(SampleUuidIdentifier.fromString(`${id}`)));

  try {
    id.test = 1;
    t.fail('id instance is mutable');
  } catch (e) {
    t.pass('id instance is immutable');
  }

  t.end();
});


test('UuidIdentifier fromString tests', (t) => {
  const idString = '4b268351-2445-4d98-a777-b461330d5c7f';
  const idString2 = '4b268351-2445-4d98-a777-b461330d5c7a';
  const id = SampleUuidIdentifier.fromString(idString);
  t.true(id instanceof Identifier);
  t.true(id instanceof UuidIdentifier);
  t.true(id instanceof SampleUuidIdentifier);

  t.same(idString, id.toString());
  t.same(idString, id.valueOf());
  t.same(idString, `${id}`);
  t.same(JSON.stringify(idString), JSON.stringify(id));
  t.true(id.equals(SampleUuidIdentifier.fromString(idString)));
  t.false(id.equals(SampleUuidIdentifier.fromString(idString2)));

  t.end();
});


test('UuidIdentifier (invalid) tests', (t) => {
  const invalid = [
    '4b268351-2445-4d98-a777-b461330d5c7fX',
    '4b268351-2445-4d98-a777-b461330d5c7',
    '4b26835124454d98a777b461330d5c7f',
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
      SampleUuidIdentifier.fromString(value);
      t.fail(`SampleUuidIdentifier.fromString accepted invalid value [${JSON.stringify(value)}].`);
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});
