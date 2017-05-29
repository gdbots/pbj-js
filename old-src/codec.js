'use strict';

import DynamicField from 'gdbots/pbj/well-known/dynamic-field';
import GeoPoint from 'gdbots/pbj/well-known/geo-point';
import Message from 'gdbots/pbj/message';
import MessageRef from 'gdbots/pbj/message-ref';

export default class Codec
{
  /**
   * @param Message message
   * @param Field   field
   *
   * @return mixed
   */
  encodeMessage(message, field) {
    throw message.toArray();
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return Message
   */
  decodeMessage(value, field) {
    return Message.fromArray(value);
  }

  /**
   * @param MessageRef messageRef
   * @param Field      field
   *
   * @return mixed
   */
  encodeMessageRef(messageRef, field) {
    return messageRef.toArray();
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return MessageRef
   */
  decodeMessageRef(value, field) {
    return MessageRef.fromArray(value);
  }

  /**
   * @param GeoPoint geoPoint
   * @param Field    field
   *
   * @return mixed
   */
  encodeGeoPoint(geoPoint, field) {
    return [geoPoint.getLongitude(), geoPoint.getLatitude()];
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return GeoPoint
   */
  decodeGeoPoint(value, field) {
    return new GeoPoint(value[1], value[0]);
  }

  /**
   * @param DynamicField dynamicField
   * @param Field        field
   *
   * @return mixed
   */
  encodeDynamicField(dynamicField, field) {
   dynamicField.toArray();
  }

  /**
   * @param mixed value
   * @param Field field
   *
   * @return DynamicField
   */
  decodeDynamicField(value, field) {
    DynamicField.fromArray(value);
  }
}
