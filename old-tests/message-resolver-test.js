'use strict';

import MessageResolver from 'gdbots/pbj/message-resolver';
import SchemaId from 'gdbots/pbj/schema-id';
import SchemaQName from 'gdbots/pbj/schema-q-name';

describe('message-resolver-test', function() {
  it('should accept value q-name', function(done) {
    let schemaId = SchemaId.fromString('pbj:acme:blog:node:article:1-0-0');
    MessageResolver.register(schemaId, 'Fake');

    let curie = MessageResolver.resolveQName(SchemaQName.fromString('acme:article'));
    schemaId.getCurie().should.eql(curie);

    done();
  });

  it('should accept invalid q-name', function(done) {
    let count = 0;
    try {
      let curie = MessageResolver.resolveQName(SchemaQName.fromString('acme:video'));
    } catch (e) {
      //console.log('MessageRef correctly failed on string [acme:video].');
      count++;
    }

    (count === 1).should.eql(true);

    done();
  });
});
