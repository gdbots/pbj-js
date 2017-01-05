'use strict';

import {expect} from 'chai';
import awsMock from 'aws-sdk-mock';
import aws from 'aws-sdk';
import ArrayUtils from 'gdbots/common/util/array-utils';
import FixtureLoader from '../fixtures/fixture-loader';
import ItemMarshaler from 'gdbots/pbj/marshaler/dynamo-db/item-marshaler.js';

describe('dynamo-db-test', function() {
  let key = process.env.AWS_KEY || 'faker';
  let secret = process.env.AWS_SECRET || 'secret';
  let tableName = process.env.DYNAMODB_TABLE || 'pbj_tests';

  if (!key || !secret) {
      return;
  }

  let dynamodb = new aws.DynamoDB({
    credentials: new aws.Credentials(key, secret),
    region: 'us-west-2',
    version: '2012-08-10'
  });

  let marshaler = new ItemMarshaler();
  let message = FixtureLoader.createEmailMessage();

  before(function() {
    awsMock.mock('DynamoDB', 'getItem', function(params, callback) {
      callback(null, {Item: params.Key});
    });

    awsMock.mock('DynamoDB', 'putItem', function(params, callback) {
      callback(null, params);
    });
  });

  after(function() {
    awsMock.restore('DynamoDB');
  });

  it('put-item', function(done) {
    dynamodb.putItem({
      TableName: tableName,
      Item: marshaler.marshal(message)
    }, function(error, data) {
      if (error) {
        console.error(error);
      }

      done();
    });
  });

  it('get-item', function(done) {
    dynamodb.getItem({
      TableName: tableName,
      ConsistentRead: true,
      Key: {
        id: {
          S: message.get('id').toString()
        }
      }
    }, function(error, data) {
      if (error) {
        console.error(error);
      }

      if (data) {
        data.Item.id.S.should.eql(message.get('id').toString());

        let result = marshaler.unmarshal(data.Item);

        ArrayUtils.each(message.schema().getFields(), function(field) {
          let expected = message.get(field.getName());
          let actual = result.get(field.getName());

          expected.should.eql(actual);
        });
      }

      done();
    });
  });
});
