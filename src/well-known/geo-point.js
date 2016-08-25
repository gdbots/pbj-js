'use strict';

import FromArray from 'gdbots/common/from-array';
import ToArray from 'gdbots/common/to-array';
import SystemUtils from 'gdbots/common/util/system-utils';
import InvalidArgumentException from 'gdbots/pbj/exception/invalid-argument-exception';

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

/**
 * Represents a GeoJson Point value.
 *
 * @link http://geojson.org/geojson-spec.html#point
 */
export default class GeoPoint extends SystemUtils.mixinClass(null, FromArray, ToArray)
{
  /**
   * @param float lat
   * @param float lon
   *
   * @throws \InvalidArgumentException
   */
  constructor(lat, lon) {
    super(); // require before using `this`

    privateProps.set(this, {
      /** @var float */
      latitude: parseFloat(lat),

      /** @var float */
      longitude: parseFloat(lon)
    });

    if (privateProps.get(this).latitude > 90.0 || privateProps.get(this).latitude < -90.0) {
      throw new InvalidArgumentException('Latitude must be within range [-90.0, 90.0]');
    }

    if (privateProps.get(this).longitude > 180.0 || privateProps.get(this).longitude < -180.0) {
      throw new InvalidArgumentException('Longitude must be within range [-180.0, 180.0]');
    }
  }

  /**
   * @return float
   */
  getLatitude() {
    return privateProps.get(this).latitude;
  }

  /**
   * @return float
   */
  getLongitude() {
    return privateProps.get(this).longitude;
  }

  /**
   * {@inheritdoc}
   */
  static fromArray(data = {}) {
    if (undefined !== data.coordinates) {
      return new this(data.coordinates[1], data.coordinates[0]);
    }

    throw new InvalidArgumentException('Payload must be a GeoJson "Point" type.');
  }

  /**
   * {@inheritdoc}
   */
  toArray() {
    return {
      'type': 'Point',
      'coordinates': [privateProps.get(this).longitude, privateProps.get(this).latitude]
    };
  }

  /**
   * @param string string A string with format lat,long
   * @return self
   */
  static fromString(string) {
    string = string.split(',');

    return new this(string[0], string[1]);
  }

  /**
   * @return string
   */
  toString() {
    return privateProps.get(this).latitude + ',' + privateProps.get(this).longitude;
  }
}
