import test from 'tape';
import Field from '../src/Field.js';
import FieldRule from '../src/enums/FieldRule.js';
import Format from '../src/enums/Format.js';
import T from '../src/types/index.js';
import SampleStringEnum from './fixtures/enums/SampleStringEnum.js';

test('Field tests', (t) => {
  let field = new Field({
    name: 'test',
    type: T.StringType.create(),
    required: true,
    format: Format.SLUG,
    defaultValue: 'homer-simpson',
  });

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

  field = new Field({
    name: 'test',
    type: T.DateType.create(),
    rule: FieldRule.A_LIST,
    overridable: true,
  });
  t.same(field.getType(), T.DateType.create());
  t.true(field.isAList());
  t.false(field.isAMap());
  t.false(field.isASet());
  t.false(field.isASingleValue());
  t.true(field.isOverridable());

  field = new Field({
    name: 'test',
    type: T.DateType.create(),
    rule: FieldRule.A_MAP,
  });
  t.same(field.getType(), T.DateType.create());
  t.false(field.isAList());
  t.true(field.isAMap());
  t.false(field.isASet());
  t.false(field.isASingleValue());
  t.false(field.isOverridable());

  field = new Field({
    name: 'test',
    type: T.UuidType.create(),
    rule: FieldRule.A_SET,
  });
  t.same(field.getType(), T.UuidType.create());
  t.false(field.isAList());
  t.false(field.isAMap());
  t.true(field.isASet());
  t.false(field.isASingleValue());
  t.false(field.isOverridable());

  field = new Field({
    name: 'test',
    type: T.UuidType.create(),
    useTypeDefault: false,
  });
  t.false(field.useTypeDefault);
  t.same(field.getDefault(), null);

  field = new Field({
    name: 'test',
    type: T.IntType.create(),
    min: 5,
    max: 10,
  });
  t.same(field.getMin(), 5);
  t.same(field.getMax(), 10);

  field = new Field({
    name: 'test',
    type: T.DecimalType.create(),
    precision: 8,
    scale: 4,
  });
  t.same(field.getPrecision(), 8);
  t.same(field.getScale(), 4);

  field = new Field({
    name: 'test',
    type: T.StringType.create(),
    minLength: 5,
    maxLength: 10,
  });
  t.same(field.getMinLength(), 5);
  t.same(field.getMaxLength(), 10);

  field = new Field({
    name: 'test',
    type: T.StringType.create(),
    pattern: '/^a-z$/',
  });
  const regex = new RegExp('^a-z$');
  t.true(field.getPattern() instanceof RegExp);
  t.same(`${field.getPattern()}`, `${regex}`);

  t.end();
});


test('Field applyDefault(Enum) tests', (t) => {
  let field = new Field({
    name: 'test',
    type: T.StringEnumType.create(),
    classProto: SampleStringEnum,
    required: true,
    defaultValue: SampleStringEnum.ENUM1.toString(),
  });
  t.true(field.defaultValue === SampleStringEnum.ENUM1);

  field = new Field({
    name: 'test',
    type: T.StringEnumType.create(),
    classProto: SampleStringEnum,
    required: true,
    defaultValue: SampleStringEnum.ENUM1,
  });
  t.true(field.defaultValue === SampleStringEnum.ENUM1);

  field = new Field({
    name: 'test',
    type: T.StringEnumType.create(),
    classProto: SampleStringEnum,
    required: true,
    defaultValue: () => SampleStringEnum.ENUM1,
  });
  t.true(field.getDefault() === SampleStringEnum.ENUM1);

  t.end();
});


test('Field getDefault(dynamic) tests', (t) => {
  const field = new Field({
    name: 'test',
    type: T.StringType.create(),
    required: true,
    defaultValue: (message, f) => {
      const m = message ? message.test : '';
      return `dynamic:${m}:${f.getName()}`;
    },
  });

  t.same(field.getDefault(null), 'dynamic::test');

  const message = { test: 1 };
  t.same(field.getDefault(message), 'dynamic:1:test');

  message.test = 2;
  t.same(field.getDefault(message), 'dynamic:2:test');

  t.end();
});


test('Field assertion tests', (t) => {
  const field = new Field({
    name: 'test',
    type: T.StringType.create(),
    required: true,
    assertion: (value) => {
      if (value === 'should_fail') {
        throw new Error('should_fail is not accepted.');
      }
    },
  });

  try {
    field.guardValue(null);
    t.fail('required field accepted null');
  } catch (e) {
    t.pass(e.message);
  }

  try {
    field.guardValue('should_fail');
    t.fail('should_fail was accepted.');
  } catch (e) {
    t.pass(e.message);
  }

  try {
    field.guardValue('should_not_fail');
    t.pass('should_not_fail was accepted.');
  } catch (e) {
    t.pass(e.message);
  }

  t.end();
});


test('Field guardDefault(A_SINGLE_VALUE) tests', (t) => {
  const field = new Field({ name: 'test', type: T.StringType.create(), rule: FieldRule.A_SINGLE_VALUE });

  try {
    field.guardDefault('value');
    t.pass('accepted a valid single value');
  } catch (e) {
    t.fail('did not accept a valid single value');
  }

  const invalid = [1, ['not-a-single-value']];
  invalid.forEach((v) => {
    try {
      field.guardDefault(v);
      t.fail('accepted an invalid single value');
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});


test('Field guardDefault(A_LIST) tests', (t) => {
  const field = new Field({ name: 'test', type: T.StringType.create(), rule: FieldRule.A_LIST });

  try {
    field.guardDefault(['string', 'test']);
    t.pass('accepted a valid list/array');
  } catch (e) {
    t.fail('did not accept a valid list/array');
  }

  const invalid = [[1], new Map(), new Set(), 'string'];
  invalid.forEach((v) => {
    try {
      field.guardDefault(v);
      t.fail('accepted an invalid list/array');
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});


test('Field guardDefault(A_MAP) tests', (t) => {
  const field = new Field({ name: 'test', type: T.StringType.create(), rule: FieldRule.A_MAP });

  try {
    field.guardDefault((new Map()).set('string', 'test'));
    t.pass('accepted a valid map');
  } catch (e) {
    t.fail('did not accept a valid map');
  }

  const invalid = [
    (new Map()).set('notastring', 1),
    new Set(),
    ['stringnotinmap'],
    'string',
  ];

  invalid.forEach((v) => {
    try {
      field.guardDefault(v);
      t.fail('accepted an invalid map');
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});


test('Field guardDefault(A_SET) tests', (t) => {
  const field = new Field({ name: 'test', type: T.StringType.create(), rule: FieldRule.A_SET });

  try {
    field.guardDefault((new Set()).add('val1').add('val2'));
    t.pass('accepted a valid set');
  } catch (e) {
    t.fail('did not accept a valid set');
  }

  const invalid = [
    (new Set()).add('val1').add(2),
    new Map(),
    ['not-a-set'],
    'not-a-set',
  ];

  invalid.forEach((v) => {
    try {
      field.guardDefault(v);
      t.fail('accepted an invalid set');
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});
