'use strict';

export default class Identifier
{
  /**
   * Creates an identifier object from a string representation
   *
   * @param string string
   *
   * @return static
   *
   * @throws \InvalidArgumentException
   */
  static fromString(string) {
    throw new Error('Interface function.');
  }

  /**
   * Returns a string that can be parsed by fromString()
   *
   * @return string
   */
  toString() {
    throw new Error('Interface function.');
  }

  /**
   * Compares the object to another Identifier object. Returns true if both have the same type and value.
   *
   * @param Identifier other
   *
   * @return boolean
   */
  equals(other) {
    throw new Error('Interface function.');
  }
}
