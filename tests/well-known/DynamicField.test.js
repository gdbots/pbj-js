import test from 'tape';
import DynamicField from '../../src/well-known/DynamicField';
import Field from '../../src/Field';

test('DynamicField property tests', (t) => {
  const df1 = DynamicField.createStringVal('test1', 'taco');
  const df2 = DynamicField.createStringVal('test2', 'pizza');
  t.true(df1 instanceof DynamicField);
  t.true(df1.getField() instanceof Field);
  t.true(df2.getField() instanceof Field);
  t.true(df1.getField() === df2.getField()); // ensures flyweight "field" instances
  t.same(df1.getName(), 'test1');
  t.same(df1.getKind(), 'string_val');
  t.same(df1.getValue(), 'taco');
  t.same(df1.toJSON(), { name: 'test1', string_val: 'taco' });
  t.same(df1.toString(), '{"name":"test1","string_val":"taco"}');

  t.same(df2.getName(), 'test2');
  t.same(df2.getKind(), 'string_val');
  t.same(df2.getValue(), 'pizza');
  t.same(df2.toJSON(), { name: 'test2', string_val: 'pizza' });
  t.same(df2.toString(), '{"name":"test2","string_val":"pizza"}');

  t.false(df1.equals(df2));
  t.false(df2.equals(df1));

  try {
    df1.test = 1;
    t.fail('df1 instance is mutable');
  } catch (e) {
    t.pass('df1 instance is immutable');
  }

  try {
    df2.test = 1;
    t.fail('df2 instance is mutable');
  } catch (e) {
    t.pass('df2 instance is immutable');
  }

  t.end();
});


test('DynamicField createBoolVal tests', (t) => {
  const df = DynamicField.createBoolVal('test', true);
  t.true(df instanceof DynamicField);
  t.true(df.getField() instanceof Field);
  t.same(df.getName(), 'test');
  t.same(df.getKind(), 'bool_val');
  t.same(df.getValue(), true);
  t.same(df.toJSON(), { name: 'test', bool_val: true });
  t.same(df.toString(), '{"name":"test","bool_val":true}');
  t.same(df, DynamicField.fromJSON(df.toString()));

  t.end();
});


test('DynamicField createDateVal tests', (t) => {
  const date = new Date(Date.UTC(2015, 11, 25));
  const df = DynamicField.createDateVal('test', date);
  t.true(df instanceof DynamicField);
  t.true(df.getField() instanceof Field);
  t.same(df.getName(), 'test');
  t.same(df.getKind(), 'date_val');
  t.same(df.getValue(), date);
  t.same(df.toJSON(), { name: 'test', date_val: '2015-12-25' });
  t.same(df.toString(), '{"name":"test","date_val":"2015-12-25"}');
  t.same(df, DynamicField.fromJSON(df.toString()));

  t.end();
});


test('DynamicField createFloatVal tests', (t) => {
  const df = DynamicField.createFloatVal('test', 3.14);
  t.true(df instanceof DynamicField);
  t.true(df.getField() instanceof Field);
  t.same(df.getName(), 'test');
  t.same(df.getKind(), 'float_val');
  t.same(df.getValue(), 3.14);
  t.same(df.toJSON(), { name: 'test', float_val: 3.14 });
  t.same(df.toString(), '{"name":"test","float_val":3.14}');
  t.same(df, DynamicField.fromJSON(df.toString()));

  t.end();
});


test('DynamicField createIntVal tests', (t) => {
  const df = DynamicField.createIntVal('test', 9000);
  t.true(df instanceof DynamicField);
  t.true(df.getField() instanceof Field);
  t.same(df.getName(), 'test');
  t.same(df.getKind(), 'int_val');
  t.same(df.getValue(), 9000);
  t.same(df.toJSON(), { name: 'test', int_val: 9000 });
  t.same(df.toString(), '{"name":"test","int_val":9000}');
  t.same(df, DynamicField.fromJSON(df.toString()));

  t.end();
});


test('DynamicField createTextVal tests', (t) => {
  const df = DynamicField.createTextVal('test', 'ice 🍦 poop 💩 doh 😳');
  t.true(df instanceof DynamicField);
  t.true(df.getField() instanceof Field);
  t.same(df.getName(), 'test');
  t.same(df.getKind(), 'text_val');
  t.same(df.getValue(), 'ice 🍦 poop 💩 doh 😳');
  t.same(df.toJSON(), { name: 'test', text_val: 'ice 🍦 poop 💩 doh 😳' });
  t.same(df.toString(), '{"name":"test","text_val":"ice 🍦 poop 💩 doh 😳"}');
  t.same(df, DynamicField.fromJSON(df.toString()));

  t.end();
});
