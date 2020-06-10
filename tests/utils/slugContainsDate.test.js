import test from 'tape';
import slugContainsDate from '../../src/utils/slugContainsDate';

test('slugContainsDate tests', (assert) => {
  const slugHasDates = '2017/05/16/homer-simpson';
  assert.equal(slugContainsDate(slugHasDates), true, `slug [${slugHasDates}] should contains date.`);

  const slugHasNoDates = ['homer-simpson', 'homer-simpson/2017/05/16/'];
  slugHasNoDates.forEach(slug => assert.equal(slugContainsDate(slug), false, `slug [${slug}] should NOT be valid.`));

  assert.end();
});
