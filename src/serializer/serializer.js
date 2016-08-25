'use strict';

export default class Serializer
{
  /**
   * @param Message message
   * @param array   options
   *
   * @return mixed
   */
  serialize(message, options = {}) {
    throw new Error('Interface function.');
  }

  /**
   * @param mixed data
   * @param array options
   *
   * @return Message
   *
   * @throws \Exception
   * @throws GdbotsPbjException
   */
  deserialize(data, options = {}) {
    throw new Error('Interface function.');
  }
}
