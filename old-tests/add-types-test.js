'use strict';

import IntEnum from './fixtures/enum/int-enum';
import Priority from './fixtures/enum/priority';
import Provider from './fixtures/enum/provider';
import StringEnum from './fixtures/enum/string-enum';
import MapsMessage from './fixtures/maps-message';
import EmailMessage from './fixtures/email-message';
import NestedMessage from './fixtures/nested-message';
import ArrayUtils from 'gdbots/common/util/array-utils';
import StringUtils from 'gdbots/common/util/string-utils';
import BigNumber from 'gdbots/pbj/well-known/big-number';
import GeoPoint from 'gdbots/pbj/well-known/geo-point';
import DynamicField from 'gdbots/pbj/well-known/dynamic-field';
import Microtime from 'gdbots/pbj/well-known/microtime';
import TimeUuidIdentifier from 'gdbots/pbj/well-known/time-uuid-identifier';
import UuidIdentifier from 'gdbots/pbj/well-known/uuid-identifier';
import MessageRef from 'gdbots/pbj/message-ref';

describe('add-types-test', function() {
  it('should add invalid types', function(done) {
    let message = MapsMessage.create();

    ArrayUtils.each(getInvalidTypeValues(), function(v, k) {
      let thrown = false;

      try {
        if (Array.isArray(v)) {
          message.addToMap(k, 'test1', v[0]);
          message.addToMap(k, 'test2', v[1]);
        } else {
          message.addToMap(k, 'test1', v);
        }
      } catch (e) {
        thrown = true;
      }

      if (!thrown) {
        if (Array.isArray(v)) {
          console.log('[' + k + '] accepted an invalid [' + StringUtils.varToString(v[0]) + '] value.');
          console.log('[' + k + '] accepted an invalid [' + StringUtils.varToString(v[1]) + '] value.');
        } else {
          console.log('[' + k + '] accepted an invalid [' + StringUtils.varToString(v) + '] value.');
        }
      }
    });

    done();
  });

  it('should add invalid type to map', function(done) {
    let shouldWork = MapsMessage.create();
    let shouldFail = Object.assign({}, shouldWork);

    /*
     * some int types won't fail because they're all ints of course, just different ranges.
     * e.g. an Int is also all other unsigned ints (except BigInt but that's a class so we're fine)
     */
    let allInts = [
      'TinyInt',
      'SmallInt',
      'MediumInt',
      'Int',
      'SignedTinyInt',
      'SignedSmallInt',
      'SignedMediumInt',
      'SignedInt',
      'Timestamp'
    ];

    let allStrings = ['Binary', 'Blob', 'MediumBlob', 'MediumText', 'String', 'Text'];

    ArrayUtils.each(shouldWork.constructor.getAllTypes(), function(type) {
      ArrayUtils.each(getTypeValues(), function(v, k) {
        let thrown = false;

        if (type == k) {
          if (Array.isArray(v)) {
            shouldWork.addToMap(type, 'test1', v[0]);
            shouldWork.addToMap(type, 'test2', v[1]);
          } else {
            shouldWork.addToMap(type, 'test1', v);
          }

          return;
        }

        try {
          if (Array.isArray(v)) {
            shouldFail.addToMap(type, 'test1', v[0]);
            shouldFail.addToMap(type, 'test2', v[1]);
          } else {
            shouldFail.addToMap(type, 'test1', v);
          }

          switch (type) {
            case 'Binary':
            case 'Blob':
            case 'MediumBlob':
            case 'MediumText':
            case 'String':
            case 'Text':
            case 'Timestamp':
              if (allStrings.indexOf(k) >= 0) {
                return;
              }
              break;

            case 'Decimal':
              if (k === 'Float') {
                return;
              }
              break;

            case 'Date':
              if (k === 'DateTime') {
                return;
              }
              break;

            case 'DateTime':
              if (k === 'Date') {
                return;
              }
              break;

            case 'Float':
              if (k === 'Decimal') {
                return;
              }
              break;

            case 'Identifier':
              if (['TimeUuid', 'Uuid'].indexOf(k) >= 0) {
                return;
              }
              break;

            case 'Uuid':
              if (['Identifier', 'TimeUuid'].indexOf(k) >= 0) {
                return;
              }
              break;

            default:
              // do nothing
          }

          if (type.name === 'IntType' && allInts.indexOf(k) >= 0) {
            return;
          }
        } catch (e) {
          thrown = true;
        }

        if (!thrown) {
          if (Array.isArray(v)) {
            console.log('[' + type + '] accepted an invalid/mismatched [' + StringUtils.varToString(v[0]) + '] value.');
            console.log('[' + type + '] accepted an invalid/mismatched [' + StringUtils.varToString(v[1]) + '] value.');
          } else {
            console.log('[' + type + '] accepted an invalid/mismatched [' + StringUtils.varToString(v) + '] value.');
          }
        }
      });
    });

    done();
  });
});

function getTypeValues() {
  return {
    'BigInt': [new BigNumber(0), new BigNumber('18446744073709551615')],
    'Binary': 'aG9tZXIgc2ltcHNvbg==',
    'Blob': 'aG9tZXIgc2ltcHNvbg==',
    'Boolean': [false, true],
    'Date': new Date(),
    'DateTime': new Date(),
    'Decimal': 3.14,
    'DynamicField': DynamicField.createIntVal('int_val', 1),
    'Float': 13213.032468,
    'GeoPoint': new GeoPoint(0.5, 102.0),
    'IntEnum': IntEnum.UNKNOWN.getValue(),
    'Int': [0, 4294967295],
    'MediumInt': [0, 16777215],
    'MediumBlob': 'aG9tZXIgc2ltcHNvbg==',
    'MediumText': 'medium text',
    'Message': NestedMessage.create(),
    'MessageRef': new MessageRef(NestedMessage.schema().getCurie(), UuidIdentifier.generate()),
    'Microtime': Microtime.create(),
    'SignedBigInt': [new BigNumber('-9223372036854775808'), new BigNumber('9223372036854775807')],
    'SignedMediumInt': [-8388608, 8388607],
    'SignedSmallInt': [-32768, 32767],
    'SignedTinyInt': [-128, 127],
    'SmallInt': [0, 65535],
    'StringEnum': StringEnum.UNKNOWN.getValue(),
    'String': 'string',
    'Text': 'text',
    'TimeUuid': TimeUuidIdentifier.generate(),
    'Timestamp': Math.floor(new Date().getTime() / 1000),
    'TinyInt': [0, 255],
    'Uuid': UuidIdentifier.generate(),
  };
}

function getInvalidTypeValues() {
  return {
    'BigInt': [new BigNumber(-1), new BigNumber('18446744073709551616')],
    'Binary': false,
    'Blob': false,
    'Boolean': 'not_a_bool',
    'Date': 'not_a_date',
    'DateTime': 'not_a_date',
    'Decimal': 1,
    'DynamicField': 'not_a_dynamic_field',
    'Float': 1,
    'GeoPoint': 'not_a_geo_point',
    'IntEnum': Priority.NORMAL.getValue(), // not the correct enum
    'Int': [-1, 4294967296],
    'MediumInt': [-1, 16777216],
    'MediumBlob': false,
    'MediumText': false,
    'Message': EmailMessage.create(), // not the correct message
    'MessageRef': 'not_a_message_ref',
    'Microtime': new Date().getTime(),
    'SignedBigInt': [new BigNumber('-9223372036854775809'), new BigNumber('9223372036854775808')],
    'SignedMediumInt': [-8388609, 8388608],
    'SignedSmallInt': [-32769, 32768],
    'SignedTinyInt': [-129, 128],
    'SmallInt': [-1, 65536],
    'StringEnum': Provider.AOL.getValue(), // not the correct enum
    'String': false,
    'Text': false,
    'TimeUuid': 'not_a_time_uuid',
    'Timestamp': 'not_a_timestamp',
    'TinyInt': [-1, 256],
    'Uuid': 'not_a_uuid',
  };
}
