import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import booleanType from '../../src/Type/booleanType';
import samples from '../fixtures/typeSamples';

test('booleanType property tests', (assert) => {
  assert.true(booleanType instanceof Type);
  assert.same(booleanType.getTypeName(), TypeName.BOOLEAN);
  assert.same(booleanType.getTypeValue(), TypeName.BOOLEAN.valueOf());
  assert.true(booleanType.isScalar());
  assert.true(booleanType.encodesToScalar());
  assert.false(booleanType.getDefault());
  assert.true(booleanType.isBoolean());
  assert.false(booleanType.isBinary());
  assert.false(booleanType.isNumeric());
  assert.false(booleanType.isString());
  assert.false(booleanType.isMessage());
  assert.false(booleanType.allowedInSet());

  try {
    booleanType.test = 1;
    assert.fail('booleanType instance is mutable');
  } catch (e) {
    assert.pass('booleanType instance is immutable');
  }

  assert.end();
});


test('booleanType guard tests', (assert) => {
  const field = new Field('test', booleanType);
  samples.guardValid(field, assert);
  samples.guardInvalid(field, assert);
  assert.end();
});


test('booleanType encode tests', (assert) => {
  assert.end();
});


test('booleanType decode tests', (assert) => {
  assert.end();
});
