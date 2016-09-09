'use strict';

import TrinaryType from 'gdbots/pbj/type/trinary-type';
import FieldBuilder from 'gdbots/pbj/field-builder';

describe('trinary-type-test', function() {
  it('validate encoding', function(done) {
    let field = FieldBuilder.create('trinary_unknown', TrinaryType.create()).build();
    let type = field.getType();

    type.encode(0, field).should.eql(0);
    type.encode(1, field).should.eql(1);
    type.encode(2, field).should.eql(2);

    done();
  });

  it('validate decoding', function(done) {
    let field = FieldBuilder.create('trinary_unknown', TrinaryType.create()).build();
    let type = field.getType();

    type.decode(null, field).should.eql(0);
    type.decode(0, field).should.eql(0);
    type.decode(1, field).should.eql(1);
    type.decode(2, field).should.eql(2);

    type.decode('0', field).should.eql(0);
    type.decode('1', field).should.eql(1);
    type.decode('2', field).should.eql(2);

    done();
  });

  it('validate values', function(done) {
    let field = FieldBuilder.create('trinary_unknown', TrinaryType.create()).build();
    let type = field.getType();

    type.guard(0, field);
    type.guard(1, field);
    type.guard(2, field);

    done();
  });

  it('invalid values validation', function(done) {
    let field = FieldBuilder.create('trinary_unknown', TrinaryType.create()).build();
    let type = field.getType();
    let thrown = false;

    let invalid = [
      'a',
      [],
      3,
      -1,
      false,
      true,
    ];

    invalid.forEach(function(val) {
      try {
        type.guard(val, field);
      } catch (e) {
        thrown = true;
      }

      if (false === thrown) {
        console.log('TrinaryType field accepted invalid value [' + val + '].');
      }
    });

    done();
  });
});
