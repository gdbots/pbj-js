import test from 'tape';
import Fb from '../src/FieldBuilder.js';
import Field from '../src/Field.js';
import Format from '../src/enums/Format.js';
import T from '../src/types/index.js';

test('FieldBuilder tests', (t) => {
  let field = Fb.create('test', T.StringType.create())
    .required()
    .format(Format.SLUG)
    .withDefault('homer-simpson')
    .build();

  t.true(field instanceof Field, 'field MUST be an instanceOf Field');
  t.same(field.getName(), 'test');
  t.true(field.isRequired());
  t.same(field.getFormat(), Format.SLUG);
  t.same(field.getType(), T.StringType.create());
  t.false(field.isAList());
  t.false(field.isAMap());
  t.false(field.isASet());
  t.true(field.isASingleValue());
  t.false(field.isOverridable());
  t.same(field.getDefault(), 'homer-simpson');

  try {
    field.test = 1;
    t.fail('field instance is mutable');
  } catch (e) {
    t.pass('field instance is immutable');
  }

  field = Fb.create('test', T.DateType.create()).asAList().overridable(true).build();
  t.same(field.getType(), T.DateType.create());
  t.true(field.isAList());
  t.false(field.isAMap());
  t.false(field.isASet());
  t.false(field.isASingleValue());
  t.true(field.isOverridable());

  field = Fb.create('test', T.DateType.create()).asAMap().build();
  t.same(field.getType(), T.DateType.create());
  t.false(field.isAList());
  t.true(field.isAMap());
  t.false(field.isASet());
  t.false(field.isASingleValue());
  t.false(field.isOverridable());

  field = Fb.create('test', T.UuidType.create()).asASet().build();
  t.same(field.getType(), T.UuidType.create());
  t.false(field.isAList());
  t.false(field.isAMap());
  t.true(field.isASet());
  t.false(field.isASingleValue());
  t.false(field.isOverridable());

  field = Fb.create('test', T.UuidType.create()).useTypeDefault(false).build();
  t.false(field.useTypeDefault);
  t.same(field.getDefault(), null);

  field = Fb.create('test', T.IntType.create()).min(5).max(10).build();
  t.same(field.getMin(), 5);
  t.same(field.getMax(), 10);

  field = Fb.create('test', T.DecimalType.create()).precision(8).scale(4).build();
  t.same(field.getPrecision(), 8);
  t.same(field.getScale(), 4);

  field = Fb.create('test', T.StringType.create()).minLength(5).maxLength(10).build();
  t.same(field.getMinLength(), 5);
  t.same(field.getMaxLength(), 10);

  field = Fb.create('test', T.StringType.create()).pattern('/^a-z$/').build();
  const regex = new RegExp('^a-z$');
  t.true(field.getPattern() instanceof RegExp);
  t.same(`${field.getPattern()}`, `${regex}`);

  t.end();
});
