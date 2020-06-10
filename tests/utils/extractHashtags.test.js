import test from 'tape';
import extractHashtags from '../../src/utils/extractHashtags';

test('extractHashtags tests', (assert) => {
  const samples = [
    {
      input: 'Hello #HomerSimpson and #HomerSimpson again!',
      output: [
        'HomerSimpson',
      ],
    },
    {
      input: 'Meet the Simpsons:\nThere\'s #Bart\nand #Lisa\nand #Doh',
      output: [
        'Bart',
        'Lisa',
        'Doh',
      ],
    },
    {
      input: 'These are not\n#Hashtags ಠ_ಠ # #1 #_ \n#1234 #2015-12-25 \n#what',
      output: [
        'Hashtags',
        'what',
      ],
    },
    {
      input: '#these#do#not#count#as#hashtags',
      output: [],
    },
  ];

  samples.forEach(({ input, output }) => {
    const hashtags = extractHashtags(input);
    assert.same(hashtags, output);
  });

  assert.end();
});
