'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import Type from 'gdbots/pbj/type/type';
import DecodeValueFailed from 'gdbots/pbj/exception/decode-value-failed';

export default class IntEnumType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!value.hasTrait('Enum')) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "Enum" but is not.');
    }

    if (field.hasClassName() && !value.hasTrait(field.getClassName())) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "' + field.getClassName() + '" but is not.');
    }

    if (value === +value && isFinite(value) && !(value % 1)) {
      throw new Error('Value "' + value + '" is not a integer.')
    }

    if (value.getValue() < this.getMin() || value.getValue() > this.getMax()) {
      throw new Error('Number "' + value.getValue() + '" was expected to be at least "' + value.getMin() + '" and at most "' + value.getMax() + '".')
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    if (value.hasTrait('Enum')) {
      return parseInt(value.getValue());
    }

    return 0;
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    if (null === value) {
      return null;
    }

    /** @var Enum className */
    className = field.getClassName();

    try {
      return eval(className + '.initEnum([value])');
    } catch (e) {
      throw new DecodeValueFailed(value, field, e);
    }
  }

  /**
   * {@inheritdoc}
   */
  isScalar() {
    return false;
  }

  /**
   * {@inheritdoc}
   */
  isNumeric() {
    return true;
  }

  /**
   * {@inheritdoc}
   */
  getMin() {
    return 0;
  }

  /**
   * {@inheritdoc}
   */
  getMax() {
    return 65535;
  }
}
