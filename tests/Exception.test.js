import test from 'tape';
import Exception from '../src/Exception.js';
import CustomException from './fixtures/CustomException.js';

test('Exception tests', (assert) => {
  const customException = new CustomException('custom message', 500);

  assert.true(customException instanceof Error, 'customException MUST be an instanceOf Error');
  assert.true(customException instanceof Exception, 'customException MUST be an instanceOf Exception');
  assert.true(customException instanceof CustomException, 'customException MUST be an instanceOf CustomException');

  assert.equal(customException.getName(), 'CustomException');
  assert.equal(customException.getMessage(), 'custom message');
  assert.equal(customException.getCode(), 500);
  assert.equal(customException.name, 'CustomException');
  assert.equal(customException.message, 'custom message');
  assert.equal(customException.code, 500);
  assert.equal(`${customException}`, 'CustomException: custom message');

  try {
    throw customException;
  } catch (e) {
    assert.true(customException instanceof Error, 'thrown customException MUST be an instanceOf Error');
    assert.true(customException instanceof Exception, 'thrown customException MUST be an instanceOf Exception');
    assert.true(customException instanceof CustomException, 'thrown customException MUST be an instanceOf CustomException');
  }

  assert.end();
});
