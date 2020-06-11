import test from 'tape';
import isValidSlug from '../../src/utils/isValidSlug';

test('isValidSlug tests', (assert) => {
  const valid = [
    { slug: 't' },
    { slug: 'test' },
    { slug: '1' },
    { slug: '1-2' },
    { slug: 'homer-simpson' },
    { slug: 'homer-simpson', allowSlashes: false },
    { slug: 'homer/simpson', allowSlashes: true },
    { slug: '2017/05/16/homer-simpson', allowSlashes: true },
    { slug: '2017/05/16/homer-simpson/2017/01/02', allowSlashes: true },
    { slug: 'homer-sim-at-ps/on', allowSlashes: true },
  ];

  valid.forEach(({ slug, allowSlashes = false }) => assert.equal(isValidSlug(slug, allowSlashes), true, `slug [${slug}] should be valid.`));

  const invalid = [
    { slug: null },
    { slug: ' ' },
    { slug: '-' },
    { slug: '_' },
    { slug: 3.14 },
    { slug: '-', allowSlashes: true },
    { slug: '/', allowSlashes: true },
    { slug: 'homer-simpson ' },
    { slug: 'beyoncéknowles' },
    { slug: 'Homer-simpson' },
    { slug: 'homer*simpson' },
    { slug: 'homer_simpson' },
    { slug: 'homer@simpson' },
    { slug: '/homer-simpson' },
    { slug: '-homer-simpson' },
    { slug: 'homer-simpson/' },
    { slug: 'homer-simpson-' },
    { slug: 'homer simpson', allowSlashes: false },
    { slug: 'homer-simpson/', allowSlashes: true },
    { slug: '2017/05/16/homer-simpson', allowSlashes: false },
    { slug: '2017/05/16/ homer-simpson', allowSlashes: true },
    { slug: '(ﾉ °益°)ﾉ 彡 ┻━┻' },
  ];

  invalid.forEach(({ slug, allowSlashes = false }) => assert.equal(isValidSlug(slug, allowSlashes), false, `slug [${slug}] should NOT be valid.`));

  assert.end();
});
