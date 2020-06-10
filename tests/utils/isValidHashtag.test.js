import test from 'tape';
import isValidHashtag from '../../src/utils/isValidHashtag';

/*
 * - must be alpha numeric (Current version does NOT support international hashtags.)
 * - must have at least one letter
 * - cannot start with an underscore (leading _ automatically removed)
 * - cannot be greater than 139 characters
 */
test('isValidHashtag tests', (assert) => {
  const valid = [
    '#HomerSimpsonIsCool',
    'HomerSimpsonIsCool',
    '2Cellos',
    '50_Cent',
    'Has_Underscores',
    'A'.repeat(139),
  ];

  valid.forEach(hashtag => assert.equal(isValidHashtag(hashtag), true, `hashtag [${hashtag}] should be valid.`));

  const invalid = [
    '#Homer Simpson Is Cool',
    'Homer Simpson Is Cool',
    'Homer-Simpson-Is-Cool',
    '_Cannot_Start_With_Underscore',
    '#_Cannot_Start_With_Underscore',
    `AHashtagShouldNotBeGreaterThan139Characters_${'HASHTAG'.repeat(14)}`,
    '1111',
    '1111_',
    'BeyoncéKnowles',
    '(╯°□°)╯︵ ┻━┻',
    'ಠ_ಠ',
    '',
    '  ',
    '-',
    '#',
    '#_',
    '#__',
    '#_ _ _',
    '- - - 1 - 2',
    '_1_2_3_4',
  ];

  invalid.forEach(hashtag => assert.equal(isValidHashtag(hashtag), false, `hashtag [${hashtag}] should NOT be valid.`));

  assert.end();
});
