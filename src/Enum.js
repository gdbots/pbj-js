const INITIALIZED = Symbol('Enum is initialized');

/**
 * This is an abstract class that is not intended to be
 * used directly. Extend it to turn your class into an enum
 * (initialization is performed via `MyEnum.configure({ENUM: 'val')`).
 *
 * Enums are flyweight objects, meaning that once imported into
 * a module only one instance of a given enum value will ever exist.
 */
export default class Enum {
  /**
   * @param {string}        name  - The name/key of the enum value.  e.g. "PUBLISHED"
   * @param {string|number} value - The value of the enum.
   */
  constructor(name, value) {
    // new.target would be better than this.constructor,
    // but isn’t supported by Babel
    if ({}.hasOwnProperty.call(this.constructor, INITIALIZED)) {
      throw new Error('Enum classes can\'t be instantiated');
    }

    Object.defineProperty(this, 'name', { value: name, enumerable: true });
    Object.defineProperty(this, 'value', { value, enumerable: true });
    Object.freeze(this);
  }

  /**
   * Configures the enum and closes the class.
   *
   * @param {Object}  values   - An object with properties of the names and instances of the enum.
   * @param {?string} [enumId] - An identifier for this enum (generally used for @gdbots/pbj lib)
   */
  static configure(values, enumId = null) {
    Object.defineProperty(this, 'instances', { value: {} });
    Object.defineProperty(this, 'enumId', { value: enumId });

    Object.keys(values).forEach((key) => {
      const instance = new this(key, values[key]);
      Object.defineProperty(this, key, { value: instance, enumerable: true });
      this.instances[key] = instance;
    });

    Object.freeze(this.instances);
    this[INITIALIZED] = true;
  }

  /**
   * Returns an Enum instance by the value.
   *
   * @param {string|number} value - The value of the enum name/key.
   *
   * @returns {Enum}
   */
  static create(value) {
    const instance = this.getKeys().filter(key => `${this.instances[key].getValue()}` === `${value}`);
    if (!instance.length) {
      throw new Error(`Value "${value}" is not part of the enum "${this.getEnumId() || this.constructor.name}"`);
    }

    return this.instances[instance[0]];
  }

  /**
   * Returns the enum id when calling from the class statically.
   *
   * @example
   * console.log(MyEnum.getEnumId());
   *
   * @returns {?string}
   */
  static getEnumId() {
    return this.enumId;
  }

  /**
   * Returns the enum id when calling from an instance of an enum class.
   *
   * @example
   * const enumInstance = MyEnum.create(MyEnum.ENUM1);
   * console.log(enumInstance.getEnumId());
   *
   * @returns {?string}
   */
  getEnumId() {
    return this.constructor.getEnumId();
  }

  /**
   * Returns the keys of the enum.
   *
   * @returns {string[]}
   */
  static getKeys() {
    return Object.keys(this.instances);
  }

  /**
   * Returns the enum keys and values as an object.  {ENUM1: "val1", ENUM2: "val2"}
   *
   * @returns {Object}
   */
  static getValues() {
    const v = {};
    this.getKeys().forEach((key) => {
      v[key] = this.instances[key].getValue();
    });
    return v;
  }

  /**
   * Returns the value of the enum.
   *
   * @returns {string}
   */
  toString() {
    return `${this.value}`;
  }

  /**
   * Returns the value of the enum.
   *
   * @returns {string|number}
   */
  toJSON() {
    return this.value;
  }

  /**
   * Returns the value of the enum.
   *
   * @returns {string|number}
   */
  valueOf() {
    return this.value;
  }

  /**
   * Returns the name of the enum.
   *
   * @returns {string}
   */
  getName() {
    return this.name;
  }

  /**
   * Returns the value of the enum.
   *
   * @returns {string|number}
   */
  getValue() {
    return this.value;
  }
}
