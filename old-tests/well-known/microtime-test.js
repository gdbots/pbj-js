'use strict';

import {expect} from 'chai';
import DateUtils from 'gdbots/common/util/date-utils.js';
import StringUtils from 'gdbots/common/util/string-utils.js';
import Microtime from 'gdbots/pbj/well-known/microtime.js';

const TEST_COUNT = 2500;

describe('microtime-test', function() {
  it('check from time-of-day', function(done) {
    let i = TEST_COUNT;
    do {
        let tod = DateUtils.gettimeofday();
        let sec = tod.sec;
        let usec = tod.usec;
        let str = sec + StringUtils.strPad(tod.usec, 6, '0', 'STR_PAD_LEFT');
        let m = Microtime.fromTimeOfDay(tod);

        expect(sec).to.be.eq(m.getSeconds());
        expect(sec).to.be.eq(Math.floor(m.toDateTime().getTime() / 1000));
        expect(usec).to.be.eq(m.getMicroSeconds());
        expect(str).to.be.eq(m.toString());

        --i;
    } while (i > 0);

    done();
  });
});
