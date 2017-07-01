import test from 'tape';
import Identifier from '../../src/well-known/Identifier';
import DatedSlugIdentifier from '../../src/well-known/DatedSlugIdentifier';
import SampleDatedSlugIdentifier from '../fixtures/well-known/SampleDatedSlugIdentifier';

test('DatedSlugIdentifier tests', (t) => {
  const id = new SampleDatedSlugIdentifier('2015/12/25/homer-simpson');
  t.true(id instanceof Identifier);
  t.true(id instanceof DatedSlugIdentifier);
  t.true(id instanceof SampleDatedSlugIdentifier);
  t.true(id.equals(SampleDatedSlugIdentifier.fromString(`${id}`)));

  try {
    id.test = 1;
    t.fail('id instance is mutable');
  } catch (e) {
    t.pass('id instance is immutable');
  }

  t.end();
});


test('DatedSlugIdentifier fromString tests', (t) => {
  const slug1 = '2015/12/25/homer-simpson';
  const slug2 = '2016/12/25/bart-simpson';
  const id = SampleDatedSlugIdentifier.fromString(slug1);
  t.true(id instanceof Identifier);
  t.true(id instanceof DatedSlugIdentifier);
  t.true(id instanceof SampleDatedSlugIdentifier);

  t.same(slug1, id.toString());
  t.same(slug1, id.valueOf());
  t.same(slug1, `${id}`);
  t.same(JSON.stringify(slug1), JSON.stringify(id));
  t.true(id.equals(SampleDatedSlugIdentifier.fromString(slug1)));
  t.false(id.equals(SampleDatedSlugIdentifier.fromString(slug2)));

  t.end();
});


test('DatedSlugIdentifier create tests', (t) => {
  const slug = '2015/12/25/homer-simpson';
  const date = new Date(2015, 11, 25);
  const id = SampleDatedSlugIdentifier.create('Homer Simpson', date);
  t.true(id instanceof Identifier);
  t.true(id instanceof DatedSlugIdentifier);
  t.true(id instanceof SampleDatedSlugIdentifier);

  t.same(slug, id.toString());
  t.same(slug, id.valueOf());
  t.same(slug, `${id}`);
  t.same(JSON.stringify(slug), JSON.stringify(id));
  t.true(id.equals(SampleDatedSlugIdentifier.fromString(slug)));

  t.end();
});


test('DatedSlugIdentifier (invalid) tests', (t) => {
  const invalid = [
    'Not a dated Slug',
    'not-a-dated-slug',
    false,
    [],
    {},
    '',
    NaN,
    undefined,
  ];

  invalid.forEach((value) => {
    try {
      SampleDatedSlugIdentifier.fromString(value);
      t.fail(`SampleDatedSlugIdentifier.fromString accepted invalid value [${JSON.stringify(value)}].`);
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});
