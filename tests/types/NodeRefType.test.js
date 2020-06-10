import test from 'tape';
import TypeName from '../../src/enums/TypeName';
import Type from '../../src/types/Type';
import Field from '../../src/Field';
import NodeRefType from '../../src/types/NodeRefType';
import helpers from './helpers';
import NodeRef from '../../src/well-known/NodeRef';

test('NodeRefType property tests', (t) => {
  const nodeRefType = NodeRefType.create();
  t.true(nodeRefType instanceof Type);
  t.true(nodeRefType instanceof NodeRefType);
  t.same(nodeRefType, NodeRefType.create());
  t.true(nodeRefType === NodeRefType.create());
  t.same(nodeRefType.getTypeName(), TypeName.NODE_REF);
  t.same(nodeRefType.getTypeValue(), TypeName.NODE_REF.valueOf());
  t.same(nodeRefType.isScalar(), false);
  t.same(nodeRefType.encodesToScalar(), true);
  t.same(nodeRefType.getDefault(), null);
  t.same(nodeRefType.isBoolean(), false);
  t.same(nodeRefType.isBinary(), false);
  t.same(nodeRefType.isNumeric(), false);
  t.same(nodeRefType.isString(), true);
  t.same(nodeRefType.isMessage(), false);
  t.same(nodeRefType.allowedInSet(), true);

  try {
    nodeRefType.test = 1;
    t.fail('NodeRefType instance is mutable');
  } catch (e) {
    t.pass('NodeRefType instance is immutable');
  }

  t.end();
});


test('NodeRefType guard tests', (t) => {
  const field = new Field({ name: 'test', type: NodeRefType.create() });
  const valid = [
    NodeRef.fromString('acme:article:123'),
    NodeRef.fromString('acme:thing-widget:test/123/456'),
  ];
  const invalid = [
    'notcomplete',
    'notcomplete:',
    'not:complete:',
    'not:complete',
    null,
    [],
    {},
    '',
    NaN,
    undefined,
  ];
  helpers.guardValidSamples(field, valid, t);
  helpers.guardInvalidSamples(field, invalid, t);
  t.end();
});


test('NodeRefType encode tests', (t) => {
  const field = new Field({ name: 'test', type: NodeRefType.create() });
  const samples = [
    {
      input: NodeRef.fromString('acme:article:123'),
      output: 'acme:article:123',
    },
    {
      input: NodeRef.fromString('acme:some-thing:123/456/789'),
      output: 'acme:some-thing:123/456/789',
    },
    { input: 0, output: null },
    { input: 1, output: null },
    { input: 2, output: null },
    { input: false, output: null },
    { input: '', output: null },
    { input: null, output: null },
    { input: undefined, output: null },
    { input: NaN, output: null },
  ];

  helpers.encodeSamples(field, samples, t);
  t.end();
});


test('NodeRefType decode tests', async (t) => {
  const field = new Field({ name: 'test', type: NodeRefType.create() });
  const samples = [
    {
      input: 'acme:article:123',
      output: NodeRef.fromString('acme:article:123'),
    },
    {
      input: 'acme:some-thing:123/456/789',
      output: NodeRef.fromString('acme:some-thing:123/456/789'),
    },
    { input: null, output: null },
  ];

  await helpers.decodeSamples(field, samples, t);
  t.end();
});


test('NodeRefType decode(invalid) tests', async (t) => {
  const field = new Field({ name: 'test', type: NodeRefType.create() });
  const samples = [
    'notcomplete',
    'notcomplete:',
    'not:complete:',
    'not:complete',
    false,
    [],
    {},
    '',
    NaN,
    undefined,
  ];
  await helpers.decodeInvalidSamples(field, samples, t);
  t.end();
});
