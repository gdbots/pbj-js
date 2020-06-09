import Enum from '../Enum';

export default class DynamicFieldKind extends Enum {
}

DynamicFieldKind.configure({
  BOOL_VAL: 'bool_val',
  DATE_VAL: 'date_val',
  FLOAT_VAL: 'float_val',
  INT_VAL: 'int_val',
  STRING_VAL: 'string_val',
  TEXT_VAL: 'text_val',
}, 'gdbots:pbj:dynamic-field-kind');
