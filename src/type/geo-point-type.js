'use strict';

import GeoPoint from 'gdbots/common/geo-point';
import Type from 'gdbots/pbj/type/type';
import EncodeValueFailed from 'gdbots/pbj/exception/encode-value-failed';
import DecodeValueFailed from 'gdbots/pbj/exception/decode-value-failed';

export default class GeoPointType extends Type
{
  /**
   * {@inheritdoc}
   */
  guard(value, field) {
    if (!(value instanceof GeoPoint)) {
      throw new Error('Class "' + value.name + '" was expected to be instanceof of "GeoPoint" but is not.');
    }
  }

  /**
   * {@inheritdoc}
   */
  encode(value, field) {
    throw new EncodeValueFailed(value, field, 'GeoPoints must be encoded with a Serializer.');
  }

  /**
   * {@inheritdoc}
   */
  decode(value, field) {
    throw new DecodeValueFailed(value, field, 'GeoPoints must be decoded with a Serializer.');
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
