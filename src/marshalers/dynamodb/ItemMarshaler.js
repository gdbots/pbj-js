let opt = {};

export default class ItemMarshaler {
  /**
   * @param {Message} message
   * @param {Object}  options
   *
   * @returns {Object}
   *
   * @throws {GdbotsPbjException}
   */
  static marshal(message, options = {}) {
    opt = options;
    const schema = message.schema();
    message.validate();

    const payload = {};
    const includeAllFields = opt.includeAllFields || false;

    schema.getFields().forEach((field) => {
      const fieldName = field.getName();
      if (!message.has(fieldName)) {
        if (includeAllFields || message.hasClearedField(fieldName)) {
          payload[fieldName] = null;
        }

        return;
      }

      const value = message.get(fieldName);
      const type = field.getType();

      if (field.isASingleValue()) {
        payload[fieldName] = type.encode(value, field, this);
        return;
      }

      if (field.isASet()) {
        payload[fieldName] = type.encode(value, field, this);
        return;
      }

      if (field.isAList()) {
        const list = {};

        // eslint-disable-next-line no-return-assign
        Object.keys(value).forEach(k => list[k] = type.encode(value[k], field, this));
        payload[fieldName] = list;

        return;
      }

      if (field.isAMap()) {
        const map = {};

        // eslint-disable-next-line no-return-assign
        Object.keys(value).forEach(k => map[k] = type.encode(value[k], field, this));
        payload[fieldName] = map;

        return;
      }

      payload[fieldName] = [];
      value.forEach(v => payload[fieldName].push(type.encode(v, field, this)));
    });

    return payload;
  }

  /**
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  static unmarshal() {
    return null;
  }
}
