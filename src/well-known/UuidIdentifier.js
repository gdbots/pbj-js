import { v4 as uuidv4 } from 'uuid';
import AssertionFailed from '../exceptions/AssertionFailed.js';
import Identifier from './Identifier.js';

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
    return new this(uuidv4());
  }
}
