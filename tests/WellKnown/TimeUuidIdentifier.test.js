import test from 'tape';
import Identifier from '../../src/WellKnown/Identifier';
import UuidIdentifier from '../../src/WellKnown/UuidIdentifier';
import TimeUuidIdentifier from '../../src/WellKnown/TimeUuidIdentifier';
import SampleTimeUuidIdentifier from '../Fixtures/WellKnown/SampleTimeUuidIdentifier';

test('TimeUuidIdentifier generate tests', (t) => {
  const id = SampleTimeUuidIdentifier.generate();
  t.true(id instanceof Identifier);
  t.true(id instanceof UuidIdentifier);
  t.true(id instanceof TimeUuidIdentifier);
  t.true(id instanceof SampleTimeUuidIdentifier);
  t.true(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-1[0-9A-Fa-f]{3}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/.test(id));
  t.true(id.equals(SampleTimeUuidIdentifier.fromString(`${id}`)));

  try {
    id.test = 1;
    t.fail('id instance is mutable');
  } catch (e) {
    t.pass('id instance is immutable');
  }

  t.end();
});


test('TimeUuidIdentifier fromString tests', (t) => {
  const idString = 'b385af9a-4413-11e7-a919-92ebcb67fe33';
  const idString2 = 'b385af9a-4413-11e7-a919-92ebcb67fe34';
  const id = SampleTimeUuidIdentifier.fromString(idString);
  t.true(id instanceof Identifier);
  t.true(id instanceof UuidIdentifier);
  t.true(id instanceof TimeUuidIdentifier);
  t.true(id instanceof SampleTimeUuidIdentifier);

  t.same(idString, id.toString());
  t.same(idString, id.valueOf());
  t.same(idString, `${id}`);
  t.same(JSON.stringify(idString), JSON.stringify(id));
  t.true(id.equals(SampleTimeUuidIdentifier.fromString(idString)));
  t.false(id.equals(SampleTimeUuidIdentifier.fromString(idString2)));

  t.end();
});


test('TimeUuidIdentifier (invalid) tests', (t) => {
  const invalid = [
    'b385af9a-4413-11e7-a919-92ebcb67fe33X',
    'b385af9a-4413-11e7-a919-92ebcb67fe3',
    'b385af9a441311e7a91992ebcb67fe33',
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
      SampleTimeUuidIdentifier.fromString(value);
      t.fail(`SampleTimeUuidIdentifier.fromString accepted invalid value [${JSON.stringify(value)}].`);
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});
