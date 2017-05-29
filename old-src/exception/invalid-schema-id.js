'use strict';

import SystemUtils from 'gdbots/common/util/system-utils';
import InvalidArgumentException from 'gdbots/pbj/exception/invalid-argument-exception';

export default class InvalidSchemaId extends SystemUtils.mixinClass(InvalidArgumentException) {}
