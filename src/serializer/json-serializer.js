'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import DeserializeMessageFailed from 'gdbots/pbj/exception/deserialize-message-failed';
import ArraySerializer from 'gdbots/pbj/serializer/array-serializer';

export default class JsonSerializer extends SystemUtils.mixinClass(ArraySerializer)
{
  /**
   * {@inheritdoc}
   */
  serialize(message, options = {}) {
    return JSON.stringify(super.serialize(message, options));
  }

  /**
   * {@inheritdoc}
   */
  deserialize(data, options = {}) {
    if (!Array.isArray(data)) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        if (!(e instanceof SyntaxError)) {
          throw new Error('Unexpected error type in JSON.parse()')
        }

        throw new DeserializeMessageFailed(getLastErrorMessage(4));
      }
    }

    return super.deserialize(data, options);
  }
}

/**
 * Resolves json_last_error message.
 *
 * @param int code
 *
 * @return string
 */
function getLastErrorMessage(code) {
  switch (code) {
    case 0: //JSON_ERROR_DEPTH
      return 'Maximum stack depth exceeded';
    case 2: //JSON_ERROR_STATE_MISMATCH
      return 'Underflow or the modes mismatch';
    case 3: //JSON_ERROR_CTRL_CHAR
      return 'Unexpected control character found';
    case 4: //JSON_ERROR_SYNTAX
      return 'Syntax error, malformed JSON';
    case 5: //JSON_ERROR_UTF8
      return 'Malformed UTF-8 characters, possibly incorrectly encoded';
    default:
      return 'Unknown error';
  }
}
