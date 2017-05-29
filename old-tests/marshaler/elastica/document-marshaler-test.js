'use strict';

import {expect} from 'chai';
import FixtureLoader from '../../fixtures/fixture-loader';
import DocumentMarshaler from 'gdbots/pbj/marshaler/elastica/document-marshaler.js';

describe('document-marshaler-test', function() {
  it('marshal', function(done) {
    let message = FixtureLoader.createEmailMessage();

    let marshaler = new DocumentMarshaler();
    let document = marshaler.marshal(message);

    let message2 = marshaler.unmarshal(document);
    message.should.eql(message2);

    done();
  });
});
