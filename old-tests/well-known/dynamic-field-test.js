'use strict';

import {expect} from 'chai';
import EmailMessage from '../fixtures/email-message';
import DynamicField from 'gdbots/pbj/well-known/dynamic-field.js';

const TEST_COUNT = 2500;

describe('dynamic-field-test', function() {
  it('add to message', function(done) {
    let message = EmailMessage.create();
    let field = DynamicField.createFloatVal('float_val', 3.14);

    message.addToList('dynamic_fields', [field]);

    message.getFromListAt('dynamic_fields', 0).should.eql(field);

    done();
  });
});
