import toString from 'lodash-es/toString.js';
import truncate from 'lodash-es/truncate.js';

/**
 * Runs guard against an array of valid samples for the provided
 * type and asserts that it *MUST* pass.
 *
 * @param {Field}  field   - The field object.
 * @param {Array}  samples - An array of valid samples to test.
 * @param {Object} test    - The test provider (with pass/fail methods).
 */
function guardValidSamples(field, samples, test) {
  const type = field.getType();
  samples.forEach((value) => {
    try {
      type.guard(value, field);
      const truncated = truncate(JSON.stringify(value));
      test.pass(`${type.getTypeName().getName()}.guard accepted valid value [${truncated}].`);
    } catch (e) {
      test.fail(e.message);
    }
  });
}

/**
 * Runs guard against an array of invalid samples for the provided
 * type and asserts that it *MUST* fail.
 *
 * @param {Field}  field   - The field object.
 * @param {Array}  samples - An array of invalid samples to test.
 * @param {Object} test    - The test provider (with pass/fail methods).
 */
function guardInvalidSamples(field, samples, test) {
  const type = field.getType();
  samples.forEach((value) => {
    try {
      type.guard(value, field);
      test.fail(`${type.getTypeName().getName()}.guard accepted invalid value [${JSON.stringify(value)}].`);
    } catch (e) {
      test.pass(e.message);
    }
  });
}

/**
 * Runs encode against the field's type with an array of samples containing
 * the input to run and the expected output.
 *
 * @param {Field}  field   - The field object.
 * @param {Array}  samples - An array of objects with input/output properties.
 * @param {Object} test    - The test provider (with pass/fail methods).
 * @param {Object} codec   - Codec to use when type requires it.
 */
function encodeSamples(field, samples, test, codec = null) {
  samples.forEach((obj) => {
    try {
      const actual = field.getType().encode(obj.input, field, codec);
      test.same(actual, obj.output);
      test.same(toString(actual), toString(obj.output));
    } catch (e) {
      test.fail(e.message);
    }
  });
}

/**
 * Runs decode against the field's type with an array of samples containing
 * the input to run and the expected output.
 *
 * @param {Field}  field   - The field object.
 * @param {Array}  samples - An array of objects with input/output properties.
 * @param {Object} test    - The test provider (with pass/fail methods).
 * @param {Object} codec   - Codec to use when type requires it.
 */
async function decodeSamples(field, samples, test, codec = null) {
  for (const obj of samples) {
    try {
      const actual = await field.getType().decode(obj.input, field, codec);
      test.same(actual, obj.output);
      test.same(toString(actual), toString(obj.output));
    } catch (e) {
      test.fail(e.message);
    }
  }
}

/**
 * Runs decode against an array of invalid samples for the provided
 * type and asserts that it *MUST* pass.
 *
 * @param {Field}  field   - The field object.
 * @param {Array}  samples - An array of invalid samples to test.
 * @param {Object} test    - The test provider (with pass/fail methods).
 * @param {Object} codec   - Codec to use when type requires it.
 */
async function decodeInvalidSamples(field, samples, test, codec = null) {
  const type = field.getType();
  for (const value of samples) {
    try {
      const decoded = await type.decode(value, field, codec);
      test.fail(`${type.getTypeName().getName()}.decode accepted invalid value [${JSON.stringify(value)}] and returned [${JSON.stringify(decoded)}].`);
    } catch (e) {
      test.pass(e.message);
    }
  }
}

export default {
  guardValidSamples,
  guardInvalidSamples,
  encodeSamples,
  decodeSamples,
  decodeInvalidSamples,
};
