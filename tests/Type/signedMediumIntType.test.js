import test from 'tape';
import TypeName from '../../src/Enum/TypeName';
import Type from '../../src/Type/Type';
import Field from '../../src/Field';
import signedMediumIntType from '../../src/Type/signedMediumIntType';
import samples from '../fixtures/typeSamples';

test('signedMediumIntType property tests', (assert) => {
  assert.true(signedMediumIntType instanceof Type);
  assert.same(signedMediumIntType.getTypeName(), TypeName.SIGNED_MEDIUM_INT);
  assert.same(signedMediumIntType.getTypeValue(), TypeName.SIGNED_MEDIUM_INT.valueOf());
  assert.same(signedMediumIntType.isScalar(), true);
  assert.same(signedMediumIntType.encodesToScalar(), true);
  assert.same(signedMediumIntType.getDefault(), 0);
  assert.same(signedMediumIntType.isBoolean(), false);
  assert.same(signedMediumIntType.isBinary(), false);
  assert.same(signedMediumIntType.isNumeric(), true);
  assert.same(signedMediumIntType.isString(), false);
  assert.same(signedMediumIntType.isMessage(), false);
  assert.same(signedMediumIntType.allowedInSet(), true);

  try {
    signedMediumIntType.test = 1;
    assert.fail('signedMediumIntType instance is mutable');
  } catch (e) {
    assert.pass('signedMediumIntType instance is immutable');
  }

  assert.end();
});


test('signedMediumIntType guard tests', (assert) => {
  const field = new Field('test', signedMediumIntType);
  samples.guardValid(field, assert);
  samples.guardInvalid(field, assert);
  // don't validate against other ints
  samples.guardMismatch(field, assert, (name => name.indexOf('_INT') !== -1));
  assert.end();
});


test('signedMediumIntType encode tests', (assert) => {
  const field = new Field('test', signedMediumIntType);
  const type = field.getType();
  assert.same(type.encode(-8388608, field), -8388608);
  assert.same(type.encode(8388607, field), 8388607);
  assert.same(type.encode(-8388607, field), -8388607);
  assert.same(type.encode(8388606, field), 8388606);
  assert.end();
});


test('signedMediumIntType decode tests', (assert) => {
  const field = new Field('test', signedMediumIntType);
  const type = field.getType();
  assert.same(type.decode(-8388608, field), -8388608);
  assert.same(type.decode(8388607, field), 8388607);
  assert.same(type.decode(-8388607, field), -8388607);
  assert.same(type.decode(8388606, field), 8388606);

  assert.same(type.decode('-8388608', field), -8388608);
  assert.same(type.decode('8388607', field), 8388607);
  assert.same(type.decode('-8388607', field), -8388607);
  assert.same(type.decode('8388606', field), 8388606);

  assert.same(type.decode('', field), 0);
  assert.same(type.decode(undefined, field), 0);
  assert.same(type.decode(null, field), 0);

  assert.end();
});
