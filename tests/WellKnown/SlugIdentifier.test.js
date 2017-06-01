import test from 'tape';
import Identifier from '../../src/WellKnown/Identifier';
import SlugIdentifier from '../../src/WellKnown/SlugIdentifier';
import SampleSlugIdentifier from '../Fixtures/WellKnown/SampleSlugIdentifier';

test('SlugIdentifier tests', (t) => {
  const id = new SampleSlugIdentifier('homer-simpson');
  t.true(id instanceof Identifier);
  t.true(id instanceof SlugIdentifier);
  t.true(id instanceof SampleSlugIdentifier);
  t.true(id.equals(SampleSlugIdentifier.fromString(`${id}`)));

  try {
    id.test = 1;
    t.fail('id instance is mutable');
  } catch (e) {
    t.pass('id instance is immutable');
  }

  t.end();
});


test('SlugIdentifier fromString tests', (t) => {
  const slug1 = 'homer-simpson';
  const slug2 = 'bart-simpson';
  const id = SampleSlugIdentifier.fromString(slug1);
  t.true(id instanceof Identifier);
  t.true(id instanceof SlugIdentifier);
  t.true(id instanceof SampleSlugIdentifier);

  t.same(slug1, id.toString());
  t.same(slug1, id.valueOf());
  t.same(slug1, `${id}`);
  t.same(JSON.stringify(slug1), JSON.stringify(id));
  t.true(id.equals(SampleSlugIdentifier.fromString(slug1)));
  t.false(id.equals(SampleSlugIdentifier.fromString(slug2)));

  t.end();
});


test('SlugIdentifier create tests', (t) => {
  const slug = 'homer-simpson';
  const id = SampleSlugIdentifier.create('Homer Simpson');
  t.true(id instanceof Identifier);
  t.true(id instanceof SlugIdentifier);
  t.true(id instanceof SampleSlugIdentifier);

  t.same(slug, id.toString());
  t.same(slug, id.valueOf());
  t.same(slug, `${id}`);
  t.same(JSON.stringify(slug), JSON.stringify(id));
  t.true(id.equals(SampleSlugIdentifier.fromString(slug)));

  t.end();
});


test('SlugIdentifier (invalid) tests', (t) => {
  const invalid = [
    'Not a Slug',
    '2015/12/25/not-a-simple-slug',
    false,
    [],
    {},
    '',
    NaN,
    undefined,
  ];

  invalid.forEach((value) => {
    try {
      SampleSlugIdentifier.fromString(value);
      t.fail(`SampleSlugIdentifier.fromString accepted invalid value [${JSON.stringify(value)}].`);
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});
