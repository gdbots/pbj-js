import test from 'tape';
import MessageRef from '../src/well-known/MessageRef';
import SchemaCurie from '../src/SchemaCurie';

test('MessageRef tests', (t) => {
  const curie = SchemaCurie.fromString('acme:blog:node:article');
  const id = '123';
  const tag = null;
  const refStr = `${curie}:${id}`;

  const ref = MessageRef.fromString(refStr);
  t.true(ref instanceof MessageRef, 'ref MUST be an instanceOf MessageRef');
  t.same(`${ref}`, refStr);
  t.same(ref.toString(), refStr);
  t.same(ref.valueOf(), refStr);
  t.same(ref.toJSON(), { curie: curie.toString(), id });
  t.same(JSON.stringify(ref), `{"curie":"${curie}","id":"${id}"}`);
  t.same(ref.getId(), id);
  t.same(ref.getTag(), tag);
  t.true(ref.hasId());
  t.false(ref.hasTag());
  t.true(ref.equals(new MessageRef(curie, id, tag)));
  t.true(ref.equals(MessageRef.fromString(refStr)));
  t.true(ref.getCurie() === curie);

  try {
    ref.test = 1;
    t.fail('ref instance is mutable');
  } catch (e) {
    t.pass('ref instance is immutable');
  }

  t.end();
});


test('MessageRef with empty tag tests', (t) => {
  const curie = SchemaCurie.fromString('acme:blog::article');
  const id = '123';
  const tag = '';
  const refStr = `${curie}:${id}`;

  const ref = new MessageRef(curie, id, tag);
  t.true(ref instanceof MessageRef, 'ref MUST be an instanceOf MessageRef');
  t.same(`${ref}`, refStr);
  t.same(ref.toString(), refStr);
  t.same(ref.valueOf(), refStr);
  t.same(ref.toJSON(), { curie: curie.toString(), id });
  t.same(JSON.stringify(ref), `{"curie":"${curie}","id":"${id}"}`);
  t.same(ref.getId(), id);
  t.same(ref.getTag(), null);
  t.true(ref.hasId());
  t.false(ref.hasTag());
  t.true(ref.equals(new MessageRef(curie, id, tag)));
  t.true(ref.equals(MessageRef.fromString(refStr)));
  t.true(ref.getCurie() === curie);

  try {
    ref.test = 1;
    t.fail('ref instance is mutable');
  } catch (e) {
    t.pass('ref instance is immutable');
  }

  t.end();
});


test('MessageRef with tag tests', (t) => {
  const curie = SchemaCurie.fromString('acme:blog:node:article');
  const id = '123';
  const tag = 'tag';
  const refStr = `${curie}:${id}#${tag}`;

  const ref = MessageRef.fromString(refStr);
  t.true(ref instanceof MessageRef, 'ref MUST be an instanceOf MessageRef');
  t.same(`${ref}`, refStr);
  t.same(ref.toString(), refStr);
  t.same(ref.valueOf(), refStr);
  t.same(ref.toJSON(), { curie: curie.toString(), id, tag });
  t.same(JSON.stringify(ref), `{"curie":"${curie}","id":"${id}","tag":"${tag}"}`);
  t.same(ref.getId(), id);
  t.same(ref.getTag(), tag);
  t.true(ref.hasId());
  t.true(ref.hasTag());
  t.true(ref.equals(new MessageRef(curie, id, tag)));
  t.true(ref.equals(MessageRef.fromString(refStr)));
  t.true(ref.getCurie() === curie);

  try {
    ref.test = 1;
    t.fail('ref instance is mutable');
  } catch (e) {
    t.pass('ref instance is immutable');
  }

  t.end();
});


test('MessageRef fromJSON tests', (t) => {
  const valid = [
    {
      input: '{"curie":"acme:blog:node:article","id":"123","tag":"tag"}',
      output: {
        curie: 'acme:blog:node:article',
        id: '123',
        tag: 'tag',
      },
    },
    {
      input: '{"curie":"acme:blog::article","id":"123","tag":"tag"}',
      output: {
        curie: 'acme:blog::article',
        id: '123',
        tag: 'tag',
      },
    },
    {
      input: '{"curie":"acme:blog::article","id":"123"}',
      output: {
        curie: 'acme:blog::article',
        id: '123',
      },
    },
    {
      input: '{"curie":"acme:blog:node:article","id":"2015/12/25/test","tag":"tag"}',
      output: {
        curie: 'acme:blog:node:article',
        id: '2015/12/25/test',
        tag: 'tag',
      },
    },
    {
      input: '{"curie":"acme:blog:node:article","id":"2015/12/25/test"}',
      output: {
        curie: 'acme:blog:node:article',
        id: '2015/12/25/test',
      },
    },
    {
      input: '{"curie":"acme:blog::article","id":"2015/12/25/test","tag":"tag"}',
      output: {
        curie: 'acme:blog::article',
        id: '2015/12/25/test',
        tag: 'tag',
      },
    },
    {
      input: '{"curie":"acme:blog::article","id":"2015/12/25/test"}',
      output: {
        curie: 'acme:blog::article',
        id: '2015/12/25/test',
      },
    },
    {
      input: '{"curie":"acme:blog::article","id":"2015/12/25/test:still:the:id"}',
      output: {
        curie: 'acme:blog::article',
        id: '2015/12/25/test:still:the:id',
      },
    },
    {
      input: '{"curie":"acme:blog::article","id":"2015/12/25/test:Still_The:id","tag":"2015.Q4"}',
      output: {
        curie: 'acme:blog::article',
        id: '2015/12/25/test:Still_The:id',
        tag: '2015.q4',
      },
    },
  ];

  valid.forEach((sample) => {
    try {
      const ref1 = MessageRef.fromJSON(sample.input);
      const ref2 = MessageRef.fromJSON(sample.input);
      t.same(`${ref1}`, `${ref2}`);
      t.same(ref1.toJSON(), sample.output);
      t.true(ref1.getCurie() === SchemaCurie.fromString(sample.output.curie));
      t.true(ref1.getCurie().toString() === sample.output.curie);
      t.same(ref1.getId(), sample.output.id);
      t.same(ref1.getTag(), sample.output.tag || null);
      t.same(ref1.hasTag(), !!sample.output.tag);
    } catch (e) {
      t.fail(e.message);
    }
  });

  t.end();
});


test('MessageRef fromString tests', (t) => {
  const valid = [
    {
      input: 'acme:blog:node:article:123#tag',
      output: {
        curie: 'acme:blog:node:article',
        id: '123',
        tag: 'tag',
      },
    },
    {
      input: 'acme:blog::article:123#tag',
      output: {
        curie: 'acme:blog::article',
        id: '123',
        tag: 'tag',
      },
    },
    {
      input: 'acme:blog::article:123',
      output: {
        curie: 'acme:blog::article',
        id: '123',
      },
    },
    {
      input: 'acme:blog:node:article:2015/12/25/test#tag',
      output: {
        curie: 'acme:blog:node:article',
        id: '2015/12/25/test',
        tag: 'tag',
      },
    },
    {
      input: 'acme:blog:node:article:2015/12/25/test',
      output: {
        curie: 'acme:blog:node:article',
        id: '2015/12/25/test',
      },
    },
    {
      input: 'acme:blog::article:2015/12/25/test#tag',
      output: {
        curie: 'acme:blog::article',
        id: '2015/12/25/test',
        tag: 'tag',
      },
    },
    {
      input: 'acme:blog::article:2015/12/25/test',
      output: {
        curie: 'acme:blog::article',
        id: '2015/12/25/test',
      },
    },
    {
      input: 'acme:blog::article:2015/12/25/test:still:the:id',
      output: {
        curie: 'acme:blog::article',
        id: '2015/12/25/test:still:the:id',
      },
    },
  ];

  valid.forEach((sample) => {
    try {
      const ref1 = MessageRef.fromString(sample.input);
      const ref2 = MessageRef.fromString(sample.input);
      t.same(`${ref1}`, `${ref2}`);
      t.same(ref1.toJSON(), sample.output);
      t.true(ref1.getCurie() === SchemaCurie.fromString(sample.output.curie));
      t.true(ref1.getCurie().toString() === sample.output.curie);
      t.same(ref1.getId(), sample.output.id);
      t.same(ref1.getTag(), sample.output.tag || null);
      t.same(ref1.hasTag(), !!sample.output.tag);
    } catch (e) {
      t.fail(e.message);
    }
  });

  t.end();
});


test('MessageRef fromString(invalid) tests', (t) => {
  const invalid = [
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
    'acme:::#tag',
    ' : ',
    ' : : : #tag',
    null,
    false,
    true,
    {},
    [],
    NaN,
  ];

  invalid.forEach((str) => {
    try {
      const ref = MessageRef.fromString(str);
      t.fail(`MessageRef [${ref}] created with invalid format [${JSON.stringify(str)}].`);
    } catch (e) {
      t.pass(e.message);
    }
  });

  t.end();
});
