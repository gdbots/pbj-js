import test from 'tape';
import createHashtag from '../../src/utils/createHashtag';

test('createHashtag tests', (assert) => {
  const samples = [
    { input: 'Homer simpson', output: 'HomerSimpson' },
    { input: 'homer simpson', output: 'HomerSimpson' },
    { input: 'Homer simpson', output: 'Homersimpson', camelize: false },
    { input: 'homer simpson', output: 'homersimpson', camelize: false },
    { input: '#TacoSpice', output: 'TacoSpice' },
    { input: '21 Grams', output: '21Grams' },
    { input: '_ snake _ case', output: 'Snake_Case' },
    { input: '_ snake _ case', output: 'snake_case', camelize: false },
    { input: 'BeyoncéKnowles', output: 'Beyonceknowles' },
    { input: 'BeyoncéKnowles', output: 'BeyonceKnowles', camelize: false },
    { input: 'Beyoncé Knowles', output: 'BeyonceKnowles' },
    { input: 'Beyoncé Knowles', output: 'BeyonceKnowles', camelize: false },
    { input: 'I can\'t believe it\'s not butter!... Spray', output: 'ICantBelieveItsNotButterSpray' },
    { input: 'homer@simpson.com', output: 'HomerAtSimpsonCom' },
    { input: 'Texas A & M', output: 'TexasAAndM' },
    { input: 'Texas A & M', output: 'TexasAAndM', camelize: false },
    { input: 'Testing % Conversion', output: 'TestingPercentConversion' },
    { input: 'Testing_%_Conversion', output: 'Testing_Percent_conversion' },
    { input: 'MPM #1234', output: 'Mpm1234' },
    { input: 'MPM #1234', output: 'MPM1234', camelize: false },
    { input: 'Magnets, How do they work?', output: 'MagnetsHowDoTheyWork' },
    { input: 'Magnets, How do they work?', output: 'MagnetsHowdotheywork', camelize: false },
    { input: 'test/123/abc', output: 'Test123abc' },
    { input: 'test/123/abc', output: 'test123abc', camelize: false },
    { input: 'http://test.com/?a=b&what', output: 'HttpTestComaBAndWhat' },

    { input: '1111', output: null },
    { input: '1111_', output: null },
    { input: '2015-12-25', output: null },
    { input: '- - - -', output: null },
    { input: '(╯°□°)╯︵ ┻━┻', output: null },
    { input: 'ಠ_ಠ', output: null },

    { input: '', output: null },
    { input: '  ', output: null },
    { input: '-', output: null },
    { input: '#', output: null },
    { input: '#_', output: null },
    { input: '#__', output: null },
    { input: '#_ _ _', output: null },
    { input: '- - - 1 - 2', output: null },
    { input: '_1_2_3_4', output: null },
  ];

  samples.forEach(({ input, output, camelize = true }) => {
    const actual = createHashtag(input, camelize);
    assert.same(actual, output);
  });

  assert.end();
});
