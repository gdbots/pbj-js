import uuid from 'uuid';
import AssertionFailed from '../Exception/AssertionFailed';
import Identifier from './Identifier';

export default class UuidIdentifier extends Identifier {
  /**
   * @param {string} value
   */
  constructor(value) {
    if (!/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/.test(value)) {
      throw new AssertionFailed(`Value "${value}" is not a valid UUID.`);
    }

    super(value);
    Object.freeze(this);
  }

  /**
   * @returns {UuidIdentifier}
   */
  static generate() {
    return new this(uuid.v4());
  }
}