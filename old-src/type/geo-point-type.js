'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import Type from 'gdbots/pbj/type/type';
import EncodeValueFailed from 'gdbots/pbj/exception/encode-value-failed';
import DecodeValueFailed from 'gdbots/pbj/exception/decode-value-failed';

export default class GeoPointType extends SystemUtils.mixinClass(Type)
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if ('GeoPoint' !== SystemUtils.getClass(value)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "GeoPoint" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field, codec = null) {
    return codec.encodeGeoPoint(value, field);
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field, codec = null) {
    return codec.decodeGeoPoint(value, field);
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
  encodesToScalar() {
    return false;
  }

  /**
   * {@inheritdoc}
   */
  allowedInSet() {
    return false;
  }
}
