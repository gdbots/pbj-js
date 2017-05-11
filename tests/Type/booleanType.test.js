import test from 'tape';
import booleanType from '../../src/Type/BooleanType';
import TypeName from '../../src/Enum/TypeName';

test('booleanType property tests', (assert) => {
  assert.same(booleanType.getTypeName(), TypeName.BOOLEAN);
  assert.same(booleanType.getTypeValue(), TypeName.BOOLEAN.valueOf());
  assert.same(booleanType.isScalar(), true);
  assert.same(booleanType.encodesToScalar(), true);
  assert.same(booleanType.getDefault(), false);
  assert.same(booleanType.isBoolean(), true);
  assert.same(booleanType.isBinary(), false);
  assert.same(booleanType.isNumeric(), false);
  assert.same(booleanType.isString(), false);
  assert.same(booleanType.isMessage(), false);
  assert.same(booleanType.allowedInSet(), false);

  try {
    booleanType.test = 1;
    assert.fail('booleanType instance is mutable');
  } catch (e) {
    assert.pass('booleanType instance is immutable');
  }

  assert.end();
});


test('booleanType guard tests', (assert) => {
  assert.end();
});


test('booleanType encode tests', (assert) => {
  assert.end();
});


test('booleanType decode tests', (assert) => {
  assert.end();
});
