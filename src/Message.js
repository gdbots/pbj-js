/**
 * Stores all message instances so data is kept
 * private and cannot be mutated directly.
 *
 * @type {WeakMap}
 */
const msgs = new WeakMap();

export default class Message {
  /**
   * Nothing fancy on new messages... we let the serializers or application code get fancy.
   */
  constructor() {
    msgs.set(this, {
      /** @var {Map} */
      data: new Map(),

      /**
       * A set of fields that have been cleared or set to null that
       * must be included when serialized so it's clear that the
       * value has been unset.
       *
       * @var {Set}
       */
      clearedFields: new Set(),

      /**
       * @see Message.freeze
       *
       * @var {boolean}
       */
      isFrozen: false,

      /**
       * @see Message.isReplay
       *
       * @var {boolean}
       */
      isReplay: false
    });
  }

  /**
   * Creates a new message with the defaults populated.
   *
   * @return {Message}
   */
  static create() {
    const msg = new this();
    return msg.populateDefaults();
  }


  populateDefaults(fieldName = null) {
    this.guardFrozenMessage();
  }
}
