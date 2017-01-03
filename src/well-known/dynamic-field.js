'use strict';

import FromArray from 'gdbots/common/from-array';
import ToArray from 'gdbots/common/to-array';
import SystemUtils from 'gdbots/common/util/system-utils';
import InvalidArgumentException from 'gdbots/pbj/exception/invalid-argument-exception';
import DynamicFieldKind from 'gdbots/pbj/enum/dynamic-field-kind';
import FieldRule from 'gdbots/pbj/enum/field-rule';
import Field from 'gdbots/pbj/field';
import BooleanType from 'gdbots/pbj/type/boolean-type';
import DateType from 'gdbots/pbj/type/date-type';
import FloatType from 'gdbots/pbj/type/float-type';
import IntType from 'gdbots/pbj/type/int-type';
import StringType from 'gdbots/pbj/type/string-type';
import TextType from 'gdbots/pbj/type/text-type';

/**
 * Regular expression pattern for matching a valid dynamic field name.
 *
 * @constant string
 */
export const VALID_NAME_PATTERN = /^[a-zA-Z_]{1}[a-zA-Z0-9_-]*/;

/**
 * Fields are only used to allow for type guarding/encoding/decoding.
 *
 * @var Field[]
 */
let _fields = [];

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

/**
 * DynamicField is a wrapper for fields which would not be ideal as a map because
 * you don't know what the field name is going to be until runtime or the number
 * of fields you'll end up having will be too large.
 *
 * A common use case is a polling or custom form service.  Eventually the number of
 * fields you have is in the thousands and systems like SQL, ElasticSearch will not
 * do well with that many fields.  DynamicField is designed to be a "named union".
 *
 * For example:
 *  [
 *    // the name of the field
 *    'name' => 'your-field-name',
 *    // only one of the following values can be populated.
 *    'bool_val' => true,
 *    'date_val' => '2015-12-25',
 *    'float_val' => 1.0,
 *    'int_val' => 1,
 *    'string_val' => 'string',
 *    'text_val' => 'some text',
 *  ]
 */
export default class DynamicField extends SystemUtils.mixinClass(null, FromArray, ToArray)
{
  /**
   * @param string           name
   * @param DynamicFieldKind kind
   * @param mixed            value
   */
  constructor(name, kind, value) {
    super(); // require before using `this`

    if (1 > name.length || name.length > 127) {
      throw new Error('DynamicField name length must be between 1 to 127.');
    }
    if (!VALID_NAME_PATTERN.test(name)) {
      throw new Error('DynamicField name [' + name + '] must match pattern [' + VALID_NAME_PATTERN + '].');
    }

    let field = createField(kind.getValue());

    privateProps.set(this, {
      /** @var string */
      name: name,

      /** @var string */
      kind: kind.getValue(),

      /** @var mixed */
      value: field.getType().decode(value, field)
    });

    field.guardValue(privateProps.get(this).value);
  }

  /**
   * @param string name
   * @param bool value
   *
   * @return self
   */
  static createBoolVal(name, value = false) {
    return new this(name, DynamicFieldKind.BOOL_VAL, value);
  }

  /**
   * @param string name
   * @param \DateTime value
   *
   * @return self
   */
  static createDateVal(name, value) {
    return new this(name, DynamicFieldKind.DATE_VAL, value);
  }

  /**
   * @param string name
   * @param float value
   *
   * @return self
   */
  static createFloatVal(name, value = 0.0) {
    return new this(name, DynamicFieldKind.FLOAT_VAL, value);
  }

  /**
   * @param string name
   * @param int value
   *
   * @return self
   */
  static createIntVal(name, value = 0) {
    return new this(name, DynamicFieldKind.INT_VAL, value);
  }

  /**
   * @param string name
   * @param string value
   *
   * @return self
   */
  static createStringVal(name, value) {
    return new this(name, DynamicFieldKind.STRING_VAL, value);
  }

  /**
   * @param string name
   * @param string value
   *
   * @return self
   */
  static createTextVal(name, value) {
    return new this(name, DynamicFieldKind.TEXT_VAL, value);
  }

  /**
   * {@inheritdoc}
   */
  static fromArray(data = {}) {
    if (undefined === data.name) {
      throw new InvalidArgumentException('DynamicField "name" property must be set.');
    }

    let name = data.name;

    delete data.name;

    let kind = Object.keys(data)[0];

    try {
      kind = DynamicFieldKind[kind.toUpperCase()];
    } catch (e) {
      throw new InvalidArgumentException('DynamicField "' + kind + '" is not a valid kind.');
    }

    return new this(name, kind, data[kind.getValue()]);
  }

  /**
   * {@inheritdoc}
   */
  toArray() {
    let field = createField(privateProps.get(this).kind);

    let data = {
      'name': privateProps.get(this).name
    };

    data[privateProps.get(this).kind] = field.getType().encode(privateProps.get(this).value, field);

    return data;
  }

  /**
   * @return string
   */
  toString() {
    return JSON.stringify(this);
  }

  /**
   * @return string
   */
  getName() {
    return privateProps.get(this).name;
  }

  /**
   * @return string
   */
  getKind() {
    return privateProps.get(this).kind;
  }

  /**
   * @return Field
   */
  getField() {
    return createField(privateProps.get(this).kind);
  }

  /**
   * @return mixed
   */
  getValue() {
    return privateProps.get(this).value;
  }

  /**
   * @param DynamicField other
   *
   * @return bool
   */
  equals(other) {
    return privateProps.get(this).name === privateProps.get(other).name
      && privateProps.get(this).kind === privateProps.get(other).kind
      && privateProps.get(this).value === privateProps.get(other).value;
  }
}

/**
 * @param string kind
 *
 * @return Field
 */
function createField(kind) {
  if (undefined === _fields[kind]) {
    let type;

    switch (kind) {
      case DynamicFieldKind.STRING_VAL.getValue():
        type = StringType.create();
        break;

      case DynamicFieldKind.TEXT_VAL.getValue():
        type = TextType.create();
        break;

      case DynamicFieldKind.INT_VAL.getValue():
        type = IntType.create();
        break;

      case DynamicFieldKind.BOOL_VAL.getValue():
        type = BooleanType.create();
        break;

      case DynamicFieldKind.FLOAT_VAL.getValue():
        type = FloatType.create();
        break;

      case DynamicFieldKind.DATE_VAL.getValue():
        type = DateType.create();
        break;

      default:
        throw new InvalidArgumentException('DynamicField "' + kind + '" is not a valid type.');
    }

    _fields[kind] = new Field(kind, type, FieldRule.A_SINGLE_VALUE, true);
  }

  return _fields[kind];
}
