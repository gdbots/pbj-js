'use strict';

import ToArray from 'gdbots/common/to-array';

let instances = {};

export default class Mixin extends ToArray
{
  /**
   * @return Mixin
   */
  static create() {
    let type = this.name;
    if (undefined === instances[type]) {
      instances[type] = new this();
    }

    return instances[type];
  }

  /**
   * Returns the id for this mixin.
   *
   * @return SchemaId
   */
  getId() {
    return null;
  }

  /**
   * Returns an array of fields that the mixin provides.
   *
   * @return Field[]
   */
  getFields() {
    return [];
  }

  /**
   * @return array
   */
  toArray() {
    return {
      id: this.getId(),
      fields: this.getFields()
    };
  }

  /**
   * @return string
   */
  toString() {
    if (this.getId()) {
      return this.getId().toString();
    }

    return null;
  }
}
