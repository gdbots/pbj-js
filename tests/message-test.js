'use strict';

import Priority from './fixtures/enum/priority';
import Provider from './fixtures/enum/provider';
import MapsMessage from './fixtures/maps-message';
import EmailMessage from './fixtures/email-message';
import NestedMessage from './fixtures/nested-message';
import Enum from 'gdbots/common/enum';
import FrozenMessageIsImmutable from 'gdbots/pbj/exception/frozen-message-is-immutable';
import JsonSerializer from 'gdbots/pbj/serializer/json-serializer';

/** @var Serializer */
let serializer = null;

/** @var EmailMessage */
let emailMessageFixture = null;

describe('maps-test', function() {
  it('should create message from array', function(done) {
    let message = createEmailMessage();
    message.set('priority', Priority.HIGH);

    message.get('priority').should.eql(Priority.HIGH);
    Priority.HIGH.should.eql(message.get('priority'));

    let json = getSerializer().serialize(message);
    message = getSerializer().deserialize(json);

    message.get('priority').should.eql(Priority.HIGH);
    Priority.HIGH.should.eql(message.get('priority'));

    message.get('nested').get('location').getLatitude().should.eql(0.5);

    done();
  });

  it('should unique items in set', function(done) {
    let message = EmailMessage.create()
      .addToSet('labels', ['CHICKEN', 'Chicken', 'chicken', 'DONUTS', 'Donuts', 'donuts']);

    message.get('labels').length.should.eql(2);
    message.get('labels').should.eql(['chicken', 'donuts']);

    done();
  });

  it('should is in set', function(done) {
    let message = EmailMessage.create()
      .addToSet('labels', ['abc'])
      .addToSet(
        'enum_in_set',
        [
          Provider.AOL,
          Provider.GMAIL,
        ]
      );

    message.isInSet('labels', 'abc').should.true;
    message.isInSet('labels', 'idontexist').should.false;
    message.isInSet('enum_in_set', Provider.AOL).should.true;
    message.isInSet('enum_in_set', Provider.HOTMAIL).should.false;

    done();
  });

  it('should enum in set', function(done) {
    let message = EmailMessage.create()
      .addToSet(
        'enum_in_set',
        [
          Provider.AOL,
          Provider.AOL,
          Provider.GMAIL,
          Provider.GMAIL,
        ]
      );

    message.get('enum_in_set').length.should.eql(2);
    message.get('enum_in_set').should.eql([Provider.AOL, Provider.GMAIL]);

    done();
  });
});

/**
 * @return Serializer
 */
function getSerializer() {
  if (null === serializer) {
    serializer = new JsonSerializer();
  }
  return serializer;
}

/**
 * @return EmailMessage
 */
function createEmailMessage() {
  if (null === emailMessageFixture) {
    emailMessageFixture = getSerializer().deserialize(jsonEmailMessage());
  }

  let message = Object.assign(emailMessageFixture);

  message.set('date_sent', new Date('2014-12-25T12:12:00.123456Z'));

  return message;
}

/**
 * @return string
 */
function jsonEmailMessage() {
  return JSON.stringify({
    "_schema": "pbj:gdbots:tests.pbj:fixtures:email-message:1-0-0",
    "id": "0dcee564-aa71-11e4-a811-3c15c2c60168",
    "from_name": "homer  ",
    "from_email": "homer@thesimpsons.com",
    "priority": 2,
    "sent": false,
    "date_sent": "2014-12-25T12:12:00.123456+00:00",
    "microtime_sent": "1422122017734617",
    "provider": "gmail",
    "labels": [
      "donuts",
      "mmmm",
      "chicken"
    ],
    "nested": {
      "_schema": "pbj:gdbots:tests.pbj:fixtures:nested-message:1-0-0",
      "test1": "val1",
      "test2": [
        1,
        2
      ],
      "location": {
        "type": "Point",
        "coordinates": [102.0,0.5]
      },
      "refs": [
        {
          "curie": "gdbots:tests.pbj:fixtures:email-message",
          "id": "0dcee564-aa71-11e4-a811-3c15c2c60168",
          "tag": "parent"
        },
        {
          "curie": "gdbots:tests.pbj:fixtures:email-message",
          "id": "0dcee564-aa71-11e4-a811-3c15c2c60168",
          "tag": "parent"
        }
      ]
    },
    "enum_in_set": [
      "aol",
      "gmail"
    ],
    "enum_in_list": [
      "aol",
      "aol",
      "gmail",
      "gmail"
    ],
    "any_of_message": [
      {
        "_schema": "pbj:gdbots:tests.pbj:fixtures:maps-message:1-0-0",
        "String": {
          "test:field:name": "value1"
        }
      },
      {
        "_schema": "pbj:gdbots:tests.pbj:fixtures:nested-message:1-0-0",
        "test1": "value1"
      }
    ]
  });
}
