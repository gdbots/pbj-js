'use strict';

import ArrayUtils from 'gdbots/common/util/array-utils';
import MessageRef from 'gdbots/pbj/message-ref';

describe('message-ref-test', function() {
  it('message-refs should be equal', function(done) {
    ArrayUtils.each(getValidMessageRefs(), function(v, k) {
      let ref1 = MessageRef.fromString(v);
      let ref2 = MessageRef.fromString(v);

      ref1.should.eql(ref2);
      ref2.should.eql(ref1);
    });

    done();
  });

  it('should accept valid message-refs', function(done) {
    ArrayUtils.each(getValidMessageRefs(), function(v, k) {
      let ref = MessageRef.fromString(v);
    });

    done();
  });

  it('should accept invalid message-refs', function(done) {
    let count = 0;
    ArrayUtils.each(getInvalidMessageRefs(), function(v, k) {
      try {
        let ref = MessageRef.fromString(v);
      } catch (e) {
        //console.log('MessageRef correctly failed on string [' + v + '].');
        count++;
      }
    });

    (count === getInvalidMessageRefs().length).should.eql(true);

    done();
  });
});

/**
 * @return array
 */
function getValidMessageRefs() {
  return [
    'acme:blog:node:article:123#tag',
    'acme:blog::article:123#tag',
    'acme:blog::article:123',
    'acme:blog:node:article:2015/12/25/test#tag',
    'acme:blog:node:article:2015/12/25/test',
    'acme:blog::article:2015/12/25/test#tag',
    'acme:blog::article:2015/12/25/test'
  ];
}

/**
 * @return array
 */
function getInvalidMessageRefs() {
  return [
    'test::what',
    'test::',
    'test:::',
    ':test',
    'john@doe.com',
    '#hashtag',
    'http://www.what.com/',
    'test.value:2015/01/01/test:what',
    'cool~topic',
    'some:thin!@##$%$%&^^&**()-=+',
    'some:test%20',
    'ACME:blog:node:article:1:2:3:4#tag',
    'ACME:blog:node:article#tag',
    'ACME:blog:node:',
    'ACME:blog::',
    'ACME:::',
    'acme:blog:node:',
    'acme:blog::',
    'acme:::',
    'acme:::#tag'
  ];
}
