'use strict';

import {expect} from 'chai';
import UuidIdentifier from 'gdbots/pbj/well-known/uuid-identifier';

describe('uuid-identifier-test', function() {
  it('using generate()', function(done) {
    let id = UuidIdentifier.generate();

    var v4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    v4Regex.test(id.toString()).should.be.true;

    done();
  });

  it('generate from string', function(done) {
    const NAMESPACE_DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

    let id = UuidIdentifier.fromString(NAMESPACE_DNS);

    (id.toString() == NAMESPACE_DNS).should.be.true;

    done();
  });

  it('check equal uuids', function(done) {
    const NAMESPACE_DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
    const NAMESPACE_OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';

    let id = UuidIdentifier.fromString(NAMESPACE_DNS);
    let id2 = UuidIdentifier.fromString(NAMESPACE_DNS);
    let id3 = UuidIdentifier.fromString(NAMESPACE_OID);

    (id.equals(id2)).should.be.true;
    (id.equals(id3)).should.be.false;

    done();
  });
});
