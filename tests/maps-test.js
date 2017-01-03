'use strict';

import MapsMessage from './fixtures/maps-message';

describe('maps-test', function() {
  it('should validate string map', function(done) {
    let message = MapsMessage.create()
      .addToMap('String', 'test1', '123')
      .addToMap('String', 'test2', '456');

    message.get('String').should.eql({
      test1: '123',
      test2: '456'
    });

    message.removeFromMap('String', 'test2');

    message.get('String').should.eql({
      test1: '123'
    });

    message
      .addToMap('String', 'test2', '456')
      .addToMap('String', 'test3', '789');

    message.get('String').should.eql({
      test1: '123',
      test2: '456',
      test3: '789'
    });

    done();
  });
});
