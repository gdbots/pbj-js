import uuid from 'uuid';
import AssertionFailed from '../exceptions/AssertionFailed';
import Identifier from './Identifier';

export default class UuidIdentifier extends Identifier {
  /**
   * @param {string} value
   */
  constructor(value) {
    super(value);

    if (!/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/.test(this.value)) {
      throw new AssertionFailed(`Value "${this.value}" is not a valid UUID.`);
    }

    Object.freeze(this);
  }

  /**
   * @returns {UuidIdentifier}
   */
  static generate() {
    return new this(uuid.v4());
  }
}
