import test from 'tape';
import moment from 'moment';
import Microtime from '../../src/well-known/Microtime.js';

test('Microtime create tests', (t) => {
  const m = Microtime.create();
  t.true(m instanceof Microtime);
  t.true(m.toDate() instanceof Date);
  t.true(m.toMoment() instanceof moment);
  t.true(moment.isMoment(m.toMoment()));
  t.true(/^[0-9]{16}$/.test(m.toString()));
  t.same(m.toString().length, 16);
  t.same(`${m}`.length, 16);

  try {
    m.test = 1;
    t.fail('m instance is mutable');
  } catch (e) {
    t.pass('m instance is immutable');
  }

  t.end();
});


test('Microtime fromString tests', (t) => {
  const mString = '1495766080123456';
  const mMoment = moment.unix(1495766080.123456);
  const mDate = mMoment.toDate();
  const m = Microtime.fromString(mString);

  t.true(m instanceof Microtime);
  t.true(m.equals(Microtime.fromString(mString)));
  t.same(m.toString(), mString);
  t.same(m.valueOf(), mString);
  t.same(m.toJSON(), mString);
  t.same(JSON.stringify(m), JSON.stringify(mString));
  t.same(`${m.toNumber()}`, '1495766080.123456');
  t.same(m.toMoment(), mMoment);
  t.same(m.toDate(), mDate);

  t.end();
});


test('Microtime fromDate tests', (t) => {
  const mString = '1495766080123000';
  const mMoment = moment.unix(1495766080.123456);
  const mDate = mMoment.toDate();
  const m = Microtime.fromDate(mDate);

  t.true(m instanceof Microtime);
  t.true(m.equals(Microtime.fromString(mString)));
  t.same(m.toString(), mString);
  t.same(m.valueOf(), mString);
  t.same(m.toJSON(), mString);
  t.same(JSON.stringify(m), JSON.stringify(mString));
  t.same(`${m.toNumber()}`, '1495766080.123');
  t.true(m.toMoment().isSame(mMoment));
  t.same(m.toDate().toISOString(), mDate.toISOString());
  t.same(m.toDate().toISOString(), '2017-05-26T02:34:40.123Z');

  t.end();
});
