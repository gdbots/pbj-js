'use strict';

import JsonSerializer from 'gdbots/pbj/serializer/json-serializer';

/** @var Serializer */
let serializer = null;

/** @var EmailMessage */
let emailMessageFixture = null;

export default class FixtureLoader
{
  /**
   * @return Message message
   */
  static cloneMessage(message) {
    return this.getSerializer().deserialize(
      this.getSerializer().serialize(message)
    );
  }

  /**
   * @return Serializer
   */
  static getSerializer() {
    if (null === serializer) {
      serializer = new JsonSerializer();
    }
    return serializer;
  }

  /**
   * @return EmailMessage
   */
  static createEmailMessage() {
    if (null === emailMessageFixture) {
      emailMessageFixture = this.getSerializer().deserialize(this.jsonEmailMessage());
    }

    let message = this.cloneMessage(emailMessageFixture);

    message.set('date_sent', new Date('2014-12-25T12:12:00.123Z'));

    return message;
  }

  /**
   * @return string
   */
  static jsonEmailMessage() {
    return {
      "_schema": "pbj:gdbots:tests.pbj:fixtures:email-message:1-0-0",
      "id": "0dcee564-aa71-11e4-a811-3c15c2c60168",
      "from_name": "homer  ",
      "from_email": "homer@thesimpsons.com",
      "priority": 2,
      "sent": false,
      "date_sent": "2014-12-25T12:12:00.123Z",
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
      ],
      "dynamic_fields": [
        {
          "name": "bool_val",
          "bool_val": true
        },
        {
          "name": "date_val",
          "date_val": "2015-12-25"
        },
        {
          "name": "float_val",
          "float_val": 3.14
        },
        {
          "name": "int_val",
          "int_val": 100
        },
        {
          "name": "string_val",
          "string_val": "string"
        },
        {
          "name": "text_val",
          "text_val": "text"
        }
      ]
    };
  }
}
