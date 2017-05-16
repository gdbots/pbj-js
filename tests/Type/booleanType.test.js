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
  const field = new Field('test', booleanType);
  samples.guardValid(field, assert);
  samples.guardInvalid(field, assert);
  assert.end();
});


test('booleanType encode tests', (assert) => {
  const field = new Field('test', booleanType);
  const type = field.getType();
  assert.same(type.encode(false, field), false);
  assert.same(type.encode('', field), false);
  assert.same(type.encode(null, field), false);
  assert.same(type.encode(undefined, field), false);
  assert.same(type.encode(true, field), true);
  assert.end();
});


test('booleanType decode tests', (assert) => {
  const field = new Field('test', booleanType);
  const type = field.getType();
  assert.same(type.decode(false, field), false);
  assert.same(type.decode('false', field), false);
  assert.same(type.decode('FALSE', field), false);
  assert.same(type.decode('False', field), false);
  assert.same(type.decode('FaLSe', field), false);
  assert.same(type.decode('0', field), false);
  assert.same(type.decode('-1', field), false);
  assert.same(type.decode('no', field), false);
  assert.same(type.decode('null', field), false);
  assert.same(type.decode('', field), false);
  assert.same(type.decode(0, field), false);
  assert.same(type.decode(-1, field), false);
  assert.same(type.decode(null, field), false);
  assert.same(type.decode(undefined, field), false);
  assert.same(type.decode({}, field), false);
  assert.same(type.decode([], field), false);

  assert.same(type.decode(true, field), true);
  assert.same(type.decode('true', field), true);
  assert.same(type.decode('TRUE', field), true);
  assert.same(type.decode('True', field), true);
  assert.same(type.decode('tRuE', field), true);
  assert.same(type.decode('1', field), true);
  assert.same(type.decode('yes', field), true);
  assert.same(type.decode('YES', field), true);
  assert.same(type.decode('Yes', field), true);
  assert.same(type.decode('+', field), true);
  assert.same(type.decode('on', field), true);
  assert.same(type.decode('ON', field), true);
  assert.same(type.decode('On', field), true);
  assert.same(type.decode(1, field), true);

  assert.end();
});
