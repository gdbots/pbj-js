import toString from 'lodash/toString';

/**
 * Runs guard against an array of valid samples for the provided
 * type and asserts that it *MUST* pass.
 *
 * @param {Field}  field   - The field object.
 * @param {Array}  samples - An array of valid samples to test.
 * @param {Object} assert  - The assert provider (with pass/fail methods).
 */
function guardValidSamples(field, samples, assert) {
  const type = field.getType();
  samples.forEach((value) => {
    try {
      type.guard(value, field);
      assert.pass(`${type.getTypeName().getName()}.guard accepted valid value [${JSON.stringify(value)}].`);
    } catch (e) {
      assert.fail(e.message);
    }
  });
}

/**
 * Runs guard against an array of invalid samples for the provided
 * type and asserts that it *MUST* pass.
 *
 * @param {Field}  field   - The field object.
 * @param {Array}  samples - An array of invalid samples to test.
 * @param {Object} assert  - The assert provider (with pass/fail methods).
 */
function guardInvalidSamples(field, samples, assert) {
  const type = field.getType();
  samples.forEach((value) => {
    try {
      type.guard(value, field);
      assert.fail(`${type.getTypeName().getName()}.guard accepted invalid value [${JSON.stringify(value)}].`);
    } catch (e) {
      assert.pass(e.message);
    }
  });
}

/**
 * Runs encode against the field's type with an array of samples containing
 * the input to run and the expected output.
 *
 * @param {Field}  field   - The field object.
 * @param {Array}  samples - An array of objects with input/output properties.
 * @param {Object} assert  - The assert provider (with pass/fail methods).
 */
function encodeSamples(field, samples, assert) {
  samples.forEach((obj) => {
    try {
      const actual = field.getType().encode(obj.input, field);
      assert.same(actual, obj.output);
      assert.same(toString(actual), toString(obj.output));
    } catch (e) {
      assert.fail(e.message);
    }
  });
}

/**
 * Runs decode against the field's type with an array of samples containing
 * the input to run and the expected output.
 *
 * @param {Field}  field   - The field object.
 * @param {Array}  samples - An array of objects with input/output properties.
 * @param {Object} assert  - The assert provider (with pass/fail methods).
 */
function decodeSamples(field, samples, assert) {
  samples.forEach((obj) => {
    try {
      const actual = field.getType().decode(obj.input, field);
      assert.same(actual, obj.output);
      assert.same(toString(actual), toString(obj.output));
    } catch (e) {
      assert.fail(e.message);
    }
  });
}

export { guardValidSamples, guardInvalidSamples, encodeSamples, decodeSamples };
