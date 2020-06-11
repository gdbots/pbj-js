import test from 'tape';
import isValidEmail from '../../src/utils/isValidEmail';

test('isValidEmail tests', (assert) => {
  const valid = [
    'foo@bar.com',
    'bar.ba@test.co.uk',
    'foo-12345@bar.com',
    'foo+bar@bar.com',
    '"email"@domain.com',
    'email@[123.123.123.123]',
    'user@[2001:DB8::1]',
    'foo_12345@bar-dash.com',
    '_______@domain.com',
    '123@123.net',
  ];

  valid.forEach(email => assert.equal(isValidEmail(email), true, `email [${email}] should be valid.`));

  const invalid = [
    null,
    ' ',
    '\t',
    '#@%^%#$@#$@#.com',
    'foo@bar',
    'fo@o@bar',
    ' example@domain.com',
    '@domain.com',
    'Joe Smith <email@domain.com>',
    'foo@ba$r.com',
    'email@123.123.123.123',
    'foo@[bar].com',
    'email@[123.123.123.300]',
    'email@[123.123.123.123',
    'user@[192:168:1:1]',
    'user@[2001:DB8:1]',
    'email@domain..com',
    'foo.bar.baz',
  ];

  invalid.forEach(email => assert.equal(isValidEmail(email), false, `email [${email}] should NOT be valid.`));

  assert.end();
});
