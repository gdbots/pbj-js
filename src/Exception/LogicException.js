import GdbotsPbjException from './GdbotsPbjException';

export default class LogicException extends GdbotsPbjException {
  /**
   * @param {string} message
   */
  constructor(message) {
    // 13 = INVALID_ARGUMENT
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L23
    super(message, 13);
  }
}
