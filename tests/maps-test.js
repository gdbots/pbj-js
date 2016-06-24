'use strict';

import MapsMessage from './fixtures/maps-message';

describe('maps-test', function() {
  it('should validate string map', function(done) {
    let message = MapsMessage.create()
      .addToMap('string', 'test1', '123')
      .addToMap('string', 'test2', '456');

    message.get('string').should.eql({
      test1: '123',
      test2: '456'
    });

    message.removeFromMap('string', 'test2');

    message.get('string').should.eql({
      test1: '123'
    });

    message
      .addToMap('string', 'test2', '456')
      .addToMap('string', 'test3', '789');

    message.get('string').should.eql({
      test1: '123',
      test2: '456',
      test3: '789'
    });

    done();
  });
});
