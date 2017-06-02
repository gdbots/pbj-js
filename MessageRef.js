/* eslint-disable */

/**
 * Represents a reference to a message.  Typically used to link messages
 * together via a correlator or "links".  Format for a reference:
 * vendor:package:category:message:id#tag (tag is optional)
 */
export default class MessageRef {

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
  static fromObject(obj) {
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
  toJSON() {
    return { type: 'Point', coordinates: [this.lon, this.lat] };
  }

  /**
   * @returns {string}
   */
  valueOf() {
    return this.toString();
  }

  /**
   * @param {MessageRef} other
   *
   * @returns {boolean}
   */
  equals(other) {
    return this.toString() === other.toString();
  }
}