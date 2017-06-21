import isArray from 'lodash/isArray';
import toFinite from 'lodash/toFinite';
import AssertionFailed from '../Exception/AssertionFailed';

/**
 * Represents a GeoJson Point value.
 * @link http://geojson.org/geojson-spec.html#point
 */
export default class GeoPoint {
  /**
   * @param {number} lat
   * @param {number} lon
   *
   * @throws {AssertionFailed}
   */
  constructor(lat, lon) {
    const flat = toFinite(toFinite(lat).toFixed(8));
    const flon = toFinite(toFinite(lon).toFixed(8));

    if (flat > 90.0 || flat < -90.0) {
      throw new AssertionFailed(`Latitude "${flat}" must be within range [-90.0, 90.0].`);
    }

    if (flon > 180.0 || flon < -180.0) {
      throw new AssertionFailed(`Longitude "${flon}" must be within range [-180.0, 180.0].`);
    }

    Object.defineProperty(this, 'lat', { value: flat });
    Object.defineProperty(this, 'lon', { value: flon });
    Object.freeze(this);
  }

  /**
   * @param {string} value
   *
   * @returns {GeoPoint}
   */
  static fromString(value) {
    const p = value.split(',');
    return new GeoPoint(p[0], p[1]);
  }

  /**
   * @param {string} json
   *
   * @returns {GeoPoint}
   */
  static fromJSON(json) {
    let obj;

    try {
      obj = JSON.parse(json);
    } catch (e) {
      throw new AssertionFailed('Invalid JSON.');
    }

    return GeoPoint.fromObject(obj);
  }

  /**
   * @param {Object} obj
   *
   * @returns {GeoPoint}
   */
  static fromObject(obj = {}) {
    if (obj.coordinates && isArray(obj.coordinates) && obj.coordinates.length === 2) {
      return new GeoPoint(obj.coordinates[1], obj.coordinates[0]);
    }

    throw new AssertionFailed('Invalid GeoJson "Point" type.');
  }

  /**
   * @returns {number}
   */
  getLatitude() {
    return this.lat;
  }

  /**
   * @returns {number}
   */
  getLongitude() {
    return this.lon;
  }

  /**
   * @returns {string}
   */
  toString() {
    return `${this.lat},${this.lon}`;
  }

  /**
   * @returns {Object}
   */
  toObject() {
    return { type: 'Point', coordinates: [this.lon, this.lat] };
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * @returns {string}
   */
  valueOf() {
    return this.toString();
  }

  /**
   * @param {GeoPoint} other
   *
   * @returns {boolean}
   */
  equals(other) {
    return `${this}` === `${other}`;
  }
}
