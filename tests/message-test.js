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
  it('create message from array', function(done) {
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

  it('unique items in set', function(done) {
    let message = EmailMessage.create()
      .addToSet('labels', ['CHICKEN', 'Chicken', 'chicken', 'DONUTS', 'Donuts', 'donuts']);

    message.get('labels').length.should.eql(2);
    message.get('labels').should.eql(['chicken', 'donuts']);

    done();
  });

  it('is in set', function(done) {
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

  it('enum in set', function(done) {
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

  it('is in list', function(done) {
    let message = createEmailMessage();

    let messageInList = message.get('any_of_message')[0];
    let messageNotInList = cloneMessage(messageInList);
    messageNotInList.addToMap('string', 'key', 'val');

    message.isInList('any_of_message', messageInList).should.true;
    message.isInList('any_of_message', messageNotInList).should.false;
    message.isInList('any_of_message', 'notinlist').should.false;
    message.isInList('any_of_message', NestedMessage.create()).should.false;
    message.isInList('enum_in_list', 'aol').should.false;
    message.isInList('enum_in_list', Provider.AOL).should.true;
    message.isInList('enum_in_list', 'notinlist').should.false;
    message.isInList('enum_in_list', Provider.HOTMAIL).should.false;

    done();
  });

  it('enum in list', function(done) {
    let message = EmailMessage.create()
      .addToList(
        'enum_in_list',
        [
          Provider.AOL,
          Provider.AOL,
          Provider.GMAIL,
          Provider.GMAIL,
        ]
      );

    message.get('enum_in_list').length.should.eql(4);
    message.get('enum_in_list').should.eql([Provider.AOL, Provider.AOL, Provider.GMAIL, Provider.GMAIL]);

    done();
  });

  it('is in map', function(done) {
    let message = MapsMessage.create();
    message.addToMap('string', 'string1', 'val1');

    message.isInMap('string', 'string1').should.true;
    message.isInMap('string', 'notinmap').should.false;
    message.isInMap('microtime', 'notinmap').should.false;

    message.clear('string');

    message.isInMap('string', 'string1').should.false;

    done();
  });

  it('nested message', function(done) {
    let message = createEmailMessage();
    let nestedMessage = NestedMessage.create()
      .set('test1', 'val1')
      .addToSet('test2', [1, 2]);

    message.set('nested', nestedMessage);

    nestedMessage.get('test2').should.eql([1, 2]);
    message.get('nested').should.eql(nestedMessage);

    done();
  });

  it('any of message in list', function(done) {
    let message = EmailMessage.create()
      .addToList(
        'any_of_message',
        [
          MapsMessage.create().addToMap('string', 'test:field:name', 'value1'),
          NestedMessage.create().set('test1', 'value1')
        ]
    );

    message.get('any_of_message').length.should.eql(2);

    done();
  });

  it('freeze', function(done) {
    let message = createEmailMessage();
    let nestedMessage = NestedMessage.create();
    message.set('nested', nestedMessage);

    message.freeze();

    message.isFrozen().should.true;
    nestedMessage.isFrozen().should.true;

    done();
  });

  it('frozen message is immutable', function(done) {
    let message = createEmailMessage();
    let nestedMessage = NestedMessage.create();
    message.set('nested', nestedMessage);

    try {

      message.freeze();

      message.set('from_name', 'homer');
      nestedMessage.set('test1', 'test1');
    } catch (e) {
      e.should.eql(new FrozenMessageIsImmutable());
    }

    done();
  });

  it('clone', function(done) {
    let message = createEmailMessage();
    let nestedMessage = NestedMessage.create();
    message.set('nested', nestedMessage);

    nestedMessage.set('test1', 'original');

    let message2 = cloneMessage(message);
    message2.set('from_name', 'marge').get('nested').set('test1', 'clone');

    (message == message2).should.false;
    (message.get('date_sent') == message2.get('date_sent')).should.false;
    (message.get('microtime_sent') == message2.get('microtime_sent')).should.false;
    (message.get('nested') == message2.get('nested')).should.false;
    (message.get('nested').get('test1') == message2.get('nested').get('test1')).should.false;

    done();
  });

  it('clone is mutable after original is frozen', function(done) {
    let message = createEmailMessage();
    let nestedMessage = NestedMessage.create();
    message.set('nested', nestedMessage);

    nestedMessage.set('test1', 'original');

    message.freeze();

    let message2 = cloneMessage(message);
    message2.set('from_name', 'marge').get('nested').set('test1', 'clone');

    try {
      message.set('from_name', 'homer').get('nested').set('test1', 'original');

      console.error('Original message should still be immutable.');
    } catch (e) {
      e.should.eql(new FrozenMessageIsImmutable());
    }

    done();
  });
});

/**
 * @return Message message
 */
function cloneMessage(message) {
  return getSerializer().deserialize(
    getSerializer().serialize(message)
  );
}

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

  let message = cloneMessage(emailMessageFixture);

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
