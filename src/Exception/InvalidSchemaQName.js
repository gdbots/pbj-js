import GdbotsPbjException from './GdbotsPbjException';

export default class InvalidSchemaQName extends GdbotsPbjException {
  /**
   * @param {string} message
   */
  constructor(message) {
    // 3 = INVALID_ARGUMENT
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L12
    super(message, 3);
  }
}
