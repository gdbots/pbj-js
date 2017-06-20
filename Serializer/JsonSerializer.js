import AssertionFailed from '../Exception/AssertionFailed';
import ObjectSerializer from './ObjectSerializer';

export default class JsonSerializer {
  /**
   * @param {Message} message
   * @param {Object}  options
   *
   * @returns {string}
   *
   * @throws {GdbotsPbjException}
   */
  static serialize(message, options = {}) {
    return JSON.stringify(ObjectSerializer.serialize(message, options));
  }

  /**
   * @param {string} json
   * @param {Object} options
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  static deserialize(json, options = {}) {
    let obj;

    try {
      obj = JSON.parse(json);
    } catch (e) {
      throw new AssertionFailed('Invalid JSON.');
    }

    return ObjectSerializer.deserialize(obj, options);
  }
}