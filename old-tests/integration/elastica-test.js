'use strict';

import {expect} from 'chai';
import elasticsearch from 'elasticsearch';
import EmailMessage from '../fixtures/email-message';
import FixtureLoader from '../fixtures/fixture-loader';
import DocumentMarshaler from 'gdbots/pbj/marshaler/elastica/document-marshaler.js';
import MappingFactory from 'gdbots/pbj/marshaler/elastica/mapping-factory.js';

/*
describe('elastica-test', function() {
  let host = process.env.ELASTIC_HOST || 'localhost';
  let port = process.env.ELASTIC_PORT || 9200;
  let indexName = process.env.ELASTIC_INDEX || 'pbj_tests';

  if (!host || !port) {
      return;
  }

  let client = null;
  let marshaler = new DocumentMarshaler();
  let message = FixtureLoader.createEmailMessage();

  before(function() {
    client = new elasticsearch.Client({
      hosts: [{
        host: host,
        port: port
      }]
    });

    let factory = new MappingFactory();
    let mappings = factory.create(EmailMessage.schema(), 'english');

    client.indices.create({
      index: indexName,
      body: {
        'mappings': mappings,
        'analysis': {
          'analyzer': MappingFactory.getCustomAnalyzers()
        }
      }
    }, function (error, response, status) {
      if (error) {
        console.error(error);
      }
    });
  });

  after(function() {
    if (null === client) {
      return;
    }

    client.delete({
      index: indexName,
    }, function (error, response, status) {
      if (error) {
        console.error(error);
      }
    });
  });

  it('add-document', function(done) {
    client.index({
      index: indexName,
      type: 'message',
      body: marshaler.marshal(message)
    }, function (error, response, status) {
      if (error) {
        console.error(error);
      }

      done();
    });
  });

  it('get-document', function(done) {
    client.search({
      index: indexName,
      type: 'message',
      body: {
        query: {
          match: {'id': 1}
        },
      }
    }, function (error, response, status) {
      if (error) {
        console.error(error);
      }

      if (response) {
        message.should.eql(marshaler.unmarshal(response));
      }

      done();
    });
  });
});*/
