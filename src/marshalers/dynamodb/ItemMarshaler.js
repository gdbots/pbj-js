import ObjectSerializer from './ObjectSerializer';

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
        payload[fieldName] = {};
        // eslint-disable-next-line no-return-assign
        Object.keys(value).forEach(k => payload[fieldName][k] = type.encode(value[k], field, this));
        return;
      }

      if (field.isAMap()) {
        payload[fieldName] = {};
        // eslint-disable-next-line no-return-assign
        Object.keys(value).forEach(k => payload[fieldName][k] = type.encode(value[k], field, this));
        return;
      }

      payload[fieldName] = [];
      value.forEach(v => payload[fieldName].push(type.encode(v, field, this)));
    });

    return payload;
  }

  /**
   * @param {Object} obj
   * @param {Object} options
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  static unmarshal(obj, options = {}) {
    return ObjectSerializer.deserialize(obj, options);
  }
}
