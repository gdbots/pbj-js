'use strict';

import NestedMessage from '../fixtures/nested-message';
import GeoPoint from 'gdbots/common/geo-point';
import BinaryType from 'gdbots/pbj/type/binary-type';
import BlobType from 'gdbots/pbj/type/blob-type';
import MediumBlobType from 'gdbots/pbj/type/medium-blob-type';
import MediumTextType from 'gdbots/pbj/type/medium-text-type';
import StringType from 'gdbots/pbj/type/string-type';
import TextType from 'gdbots/pbj/type/text-type';
import Fb from 'gdbots/pbj/field-builder';

describe('type-test', function() {
  it('should validate geo-point type', function(done) {
      let point = GeoPoint.fromArray({
        type: 'Point',
        coordinates: [102.0, 0.5]
      });

      let message = NestedMessage.create();
      message.set('location', point);

      message.get('location').getLatitude().should.eql(0.5);
      message.get('location').getLongitude().should.eql(102.0);
      message.toArray().location.should.eql(point.toArray());

      done();
  });

  it('should thrown an exception when guard max-bytes invalid', function(done) {
    let types = [
      BinaryType, BlobType, MediumBlobType,
      MediumTextType, StringType, TextType
    ];

    types.forEach(function(TypeName) {
      let field = Fb.create(TypeName.name, TypeName.create()).build();
      let text = 'a'.repeat(field.getType().getMaxBytes() + 1);
      let thrown = false;

      try {
        field.getType().guard(text, field);
      } catch (e) {
        thrown = true;
      }

      thrown.should.eql(true);

      if (false === thrown) {
        console.log('[' + TypeName.name + '] accepted more than [' + field.getType().getMaxBytes() + '] bytes.');
      }
    });

    done();
  });
});
