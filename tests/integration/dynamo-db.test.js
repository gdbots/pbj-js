'use strict';

import {expect} from 'chai';
import awsMock from 'aws-sdk-mock';
import aws from 'aws-sdk';
import ArrayUtils from 'gdbots/common/util/array-utils';
import FixtureLoader from '../fixtures/fixture-loader';
import ItemMarshaler from 'gdbots/pbj/marshaler/dynamo-db/item-marshaler.js';

/** @var DynamoDbClient */
let _dynamodb = new aws.DynamoDB({region: 'us-west-2'});

/** @var ItemMarshaler */
let _marshaler = new ItemMarshaler();

/** @var EmailMessage */
let _message = FixtureLoader.createEmailMessage();

describe('dynamo-db-test', function() {
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
    _dynamodb.putItem({
      TableName: 'test',
      Item: _marshaler.marshal(_message)
    }, function(error, data) {
      if (error) {
        throw new Error(error);
      }

      done();
    });
  });

  it('get-item', function(done) {
    _dynamodb.getItem({
      TableName: 'test',
      ConsistentRead: true,
      Key: {
        id: {
          S: _message.get('id').toString()
        }
      }
    }, function(error, data) {
      if (error) {
        throw new Error(error);
      }

      data.Item.id.S.should.eql(_message.get('id').toString());

      let message = _marshaler.unmarshal(data.Item);

      ArrayUtils.each(_message.schema().getFields(), function(field) {
        let expected = _message.get(field.getName());
        let actual = message.get(field.getName());

        expected.should.eql(actual);
      });

      done();
    });
  });
});
