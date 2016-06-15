'use strict';

import InvalidResolvedSchema from 'gdbots/pbj/exception/invalid-resolved-schema';
import Message from 'gdbots/pbj/message';
import MessageResolver from 'gdbots/pbj/message-resolver';
import Schema from 'gdbots/pbj/schema';

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

  /**
   * @param string schemaId
   *
   * @return Message
   *
   * @throws InvalidResolvedSchema
   */
  createMessage(schemaId) {
    schemaId = SchemaId.fromString(schemaId);
    className = MessageResolver.resolveId(schemaId);

    /** @var Message message */
    message = new className();
    if (!message instanceof Message) {
      throw new Error('Invalid message.');
    }

    if (message.constructor.schema().getCurieMajor() !== schemaId.getCurieMajor()) {
      throw new InvalidResolvedSchema(message.constructor.schema(), schemaId, className);
    }

    return message;
  }
}
