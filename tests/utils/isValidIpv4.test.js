import test from 'tape';
import isValidIpv4 from '../../src/utils/isValidIpv4.js';

test('isValidIpv4 tests', (assert) => {
  const valid = [
    '192.168.1.1',
    '255.255.255.255',
    '0.0.0.0',
  ];

  valid.forEach(ip => assert.equal(isValidIpv4(ip), true, `ip; [${ip}] should be valid ipv4.`));

  const invalid = [
    null,
    '#@%.^%.#$@#.$@#',
    '255:192:168:1',
    '192.168.1.1a',
    ' 192.168.1.1 ',
    '192.168.01.1',
    '.192.168.1',
    '192.168.1',
    '192.168.1.',
    '192.168.1.1.2',
    '192.168.1.256',
  ];

  invalid.forEach(ip => assert.equal(isValidIpv4(ip), false, `ip [${ip}] should NOT be valid ipv4.`));

  assert.end();
});
