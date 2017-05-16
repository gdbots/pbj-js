import TypeName from '../../src/Enum/TypeName';

const valid = {
  [TypeName.BOOLEAN.getName()]: [true, false],
  [TypeName.TINY_INT.getName()]: [0, 255, 1, 254],
};

/**
 * Runs guard against the field's type with the valid samples
 * for that type and asserts that it *MUST* pass.
 *
 * @param {Field}    field  - The field object.
 * @param {Function} assert - The assert provider (with pass/fail methods).
 */
function guardValid(field, assert) {
  const type = field.getType();
  valid[type.getTypeName().getName()].forEach((value) => {
    try {
      type.guard(value, field);
      assert.pass(`Field [${field.getName()}] guard accepted valid value [${JSON.stringify(value)}].`);
    } catch (e) {
      assert.fail(e.message);
    }
  });
}

/**
 * Runs guard against the field's type with all of the other types
 * and asserts that it *MUST* fail.  This ensures that a field
 * doesn't accept types it shouldn't.
 *
 * Use a custom filter to eliminate type inputs that are valid with
 * multiple types, e.g. a tiny int is also every other int type.
 * name => -1 !== name.indexOf('_INT')
 * NOTE: The type for the given field is already removed.
 *
 * @param {Field}    field  - The field object.
 * @param {Function} assert - The assert provider (with pass/fail methods).
 * @param {Function} filter - A custom function to filter the type values to use.
 *
 */
function guardInvalid(field, assert, filter = null) {
  const type = field.getType();
  Object.keys(valid)
    .filter(name => name !== type.getTypeName().getName())
    .filter(filter || (() => true))
    .forEach((key) => {
      valid[key].forEach((value) => {
        try {
          type.guard(value, field);
          assert.fail(`Field [${field.getName()}] guard accepted invalid value [${JSON.stringify(value)}].`);
        } catch (e) {
          assert.pass(e.message);
        }
      });
    });
}

export default { valid, guardValid, guardInvalid };
