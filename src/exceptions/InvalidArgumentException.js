import GdbotsPbjException from './GdbotsPbjException.js';

export default class InvalidArgumentException extends GdbotsPbjException {
  /**
   * @param {string} message
   */
  constructor(message) {
    // 3 = INVALID_ARGUMENT
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L12
    super(message, 3);
  }
}
