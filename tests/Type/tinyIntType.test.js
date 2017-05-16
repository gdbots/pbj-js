import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import tinyIntType from '../../src/Type/tinyIntType';
import samples from '../fixtures/typeSamples';

test('tinyIntType property tests', (assert) => {
  assert.true(tinyIntType instanceof Type);
  assert.same(tinyIntType.getTypeName(), TypeName.TINY_INT);
  assert.same(tinyIntType.getTypeValue(), TypeName.TINY_INT.valueOf());
  assert.same(tinyIntType.isScalar(), true);
  assert.same(tinyIntType.encodesToScalar(), true);
  assert.same(tinyIntType.getDefault(), 0);
  assert.same(tinyIntType.isBoolean(), false);
  assert.same(tinyIntType.isBinary(), false);
  assert.same(tinyIntType.isNumeric(), true);
  assert.same(tinyIntType.isString(), false);
  assert.same(tinyIntType.isMessage(), false);
  assert.same(tinyIntType.allowedInSet(), true);

  try {
    tinyIntType.test = 1;
    assert.fail('tinyIntType instance is mutable');
  } catch (e) {
    assert.pass('tinyIntType instance is immutable');
  }

  assert.end();
});


test('tinyIntType guard tests', (assert) => {
  const field = new Field('test', tinyIntType);
  samples.guardValid(field, assert);
  samples.guardInvalid(field, assert);
  // don't validate against other ints
  samples.guardMismatch(field, assert, (name => name.indexOf('_INT') !== -1));
  assert.end();
});


test('tinyIntType encode tests', (assert) => {
  const field = new Field('test', tinyIntType);
  const type = field.getType();
  assert.same(type.encode(0, field), 0);
  assert.same(type.encode(255, field), 255);
  assert.same(type.encode(1, field), 1);
  assert.same(type.encode(254, field), 254);
  assert.end();
});


test('tinyIntType decode tests', (assert) => {
  const field = new Field('test', tinyIntType);
  const type = field.getType();
  assert.same(type.decode(0, field), 0);
  assert.same(type.decode(255, field), 255);
  assert.same(type.decode(1, field), 1);
  assert.same(type.decode(254, field), 254);

  assert.same(type.decode('0', field), 0);
  assert.same(type.decode('255', field), 255);
  assert.same(type.decode('1', field), 1);
  assert.same(type.decode('254', field), 254);

  assert.same(type.decode('', field), 0);
  assert.same(type.decode(undefined, field), 0);
  assert.same(type.decode(null, field), 0);

  assert.end();
});
