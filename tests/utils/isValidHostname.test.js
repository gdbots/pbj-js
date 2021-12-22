import test from 'tape';
import isValidHostname from '../../src/utils/isValidHostname.js';

test('isValidHostname tests', (assert) => {
  const testcases = [
    { output: true, value: 'mydomain.com' },
    { output: true, value: 'www.mydomain.com' },
    { output: true, value: 'en.wikipedia.org' },
    { output: true, value: 'abc' },
    { output: true, value: '28999x' },

    { output: false, value: ' mydomain.com' },
    { output: false, value: '28999' },
    { output: false, value: 'http://www.mydomain.com' },
    { output: false, value: 'www.mydomain.com/page' },
    { output: false, value: 'mydomain.com#page' },
    { output: false, value: '192.168.0.2000000000' },
    { output: false, value: '*hi*' },
    { output: false, value: '-hi-' },
    { output: false, value: '_domain' },
    { output: false, value: ':54:sda54' },
  ];

  testcases.forEach(({ output, value }) => {
    const actual = isValidHostname(value);
    assert.same(actual, output, `test case [${value}] should return [${output}]`);
  });

  assert.end();
});
