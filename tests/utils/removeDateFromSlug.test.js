import test from 'tape';
import removeDateFromSlug from '../../src/utils/removeDateFromSlug';

test('removeDateFromSlug tests', (assert) => {
  const slugs = [
    { input: '2017/05/16', output: '' },
    { input: '2017/05/16/homer-simpson', output: 'homer-simpson' },
    { input: '/2017/05/16/2017/05/18/homer-simpson', output: 'homer-simpson' },
    { input: '2017/05/16/homer-simpson/2017/05/16/', output: 'homer-simpson/2017/05/16' },
  ];

  slugs.forEach(({ input, output }) => {
    const actual = removeDateFromSlug(input);
    assert.same(actual, output);
  });

  assert.end();
});
