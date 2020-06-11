import test from 'tape';
import createSlugFromCamel from '../../src/utils/createSlugFromCamel';

test('createSlugFromCamel tests', (assert) => {
  const samples = [
    { input: 'HomerSimpson', output: 'homer-simpson' },
    { input: 'SIMPSON', output: 's-i-m-p-s-o-n' },
    { input: 'homerSimpson', output: 'homer-simpson' },
    { input: 'HomerSim123pson', output: 'homer-sim123pson' },
    { input: '1HomerSimpson', output: '1-homer-simpson' },
    { input: 'Mc_Hammer', output: 'mc-hammer' },
  ];

  samples.forEach(({ input, output, allowSlashes = false }) => {
    const actual = createSlugFromCamel(input, allowSlashes);
    assert.same(actual, output);
  });

  assert.end();
});
