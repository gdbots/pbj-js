import { v1 as uuidv1 } from 'uuid';
import AssertionFailed from '../exceptions/AssertionFailed.js';
import UuidIdentifier from './UuidIdentifier.js';

export default class TimeUuidIdentifier extends UuidIdentifier {
  /**
   * @param {string} value
   */
  constructor(value) {
    super(value);

    if (!/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-1[0-9A-Fa-f]{3}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/.test(this.value)) {
      throw new AssertionFailed(`Value "${this.value}" is not a valid version 1 UUID.`);
    }

    Object.freeze(this);
  }

  /**
   * @returns {TimeUuidIdentifier}
   */
  static generate() {
    return new this(uuidv1());
  }
}
