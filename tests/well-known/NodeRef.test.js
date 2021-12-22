import test from 'tape';
import AssertionFailed from '../../src/exceptions/AssertionFailed.js';
import InvalidSchemaQName from '../../src/exceptions/InvalidSchemaQName.js';
import MessageRef from '../../src/well-known/MessageRef.js';
import SchemaQName from '../../src/SchemaQName.js';
import NodeRef from '../../src/well-known/NodeRef.js';


test('NodeRef tests', (t) => {
  const nodeRef = NodeRef.fromString('acme:article:123');
  t.true(nodeRef instanceof NodeRef);
  t.true(nodeRef.equals(NodeRef.fromString(`${nodeRef}`)));
  t.same(nodeRef.getVendor(), 'acme');
  t.same(NodeRef.fromString('acme-widgets:article:123').getVendor(), 'acme-widgets');
  t.same(nodeRef.getLabel(), 'article');
  t.same(nodeRef.getId(), '123');
  t.same(`${nodeRef}`, 'acme:article:123');
  t.true(nodeRef.getQName() === SchemaQName.fromString('acme:article'));

  try {
    nodeRef.test = 1;
    t.fail('nodeRef instance is mutable');
  } catch (e) {
    t.pass('nodeRef instance is immutable');
  }

  t.end();
});


test('NodeRef with complicated id tests', (t) => {
  const nodeRef = NodeRef.fromString('acme:article:this/id/is:WeirD:and:_.what');
  t.same(nodeRef.getVendor(), 'acme');
  t.same(nodeRef.getLabel(), 'article');
  t.same(nodeRef.getId(), 'this/id/is:WeirD:and:_.what');
  t.same(`${nodeRef}`, 'acme:article:this/id/is:WeirD:and:_.what');
  t.end();
});


test('NodeRef equals tests', (t) => {
  const nodeRef1 = NodeRef.fromString('acme:article:123');
  let nodeRef2 = NodeRef.fromString('acme:article:123');
  t.true(nodeRef1.equals(nodeRef2));
  t.true(nodeRef2.equals(nodeRef1));

  nodeRef2 = NodeRef.fromString('acme:article:1234');
  t.false(nodeRef1.equals(nodeRef2));
  t.false(nodeRef2.equals(nodeRef1));

  t.end();
});


test('NodeRef invalid tests', (t) => {
  try {
    NodeRef.fromString('ACME:article:123');
    t.fail('nodeRef created with invalid SchemaQName');
  } catch (e) {
    t.true(e instanceof InvalidSchemaQName, 'Exception MUST be an instanceOf InvalidSchemaQName');
    t.pass(e.message);
  }

  try {
    NodeRef.fromString('');
    t.fail('nodeRef created with empty string');
  } catch (e) {
    t.true(e instanceof InvalidSchemaQName, 'Exception MUST be an instanceOf InvalidSchemaQName');
    t.pass(e.message);
  }

  try {
    NodeRef.fromString('acme:article:invalid!#id');
    t.fail('nodeRef created with invalid id');
  } catch (e) {
    t.true(e instanceof AssertionFailed, 'Exception MUST be an instanceOf AssertionFailed');
    t.pass(e.message);
  }

  try {
    NodeRef.fromString('acme:article');
    t.fail('nodeRef created with missing id');
  } catch (e) {
    t.true(e instanceof AssertionFailed, 'Exception MUST be an instanceOf AssertionFailed');
    t.pass(e.message);
  }

  t.end();
});


test('NodeRef fromMessageRef tests', (t) => {
  const nodeRef = NodeRef.fromMessageRef(MessageRef.fromString('acme:blog:node:article:123'));
  t.same(nodeRef.getVendor(), 'acme');
  t.same(nodeRef.getLabel(), 'article');
  t.same(nodeRef.getId(), '123');
  t.end();
});


test('NodeRef toFilePath tests', (t) => {
  let nodeRef = NodeRef.fromString('acme:article:123');
  t.same(nodeRef.toFilePath(), 'acme/article/20/2c/123');
  t.true(nodeRef.equals(NodeRef.fromFilePath(nodeRef.toFilePath())));
  t.same(`${nodeRef}`, `${NodeRef.fromFilePath(nodeRef.toFilePath())}`);

  nodeRef = NodeRef.fromString('acme:article:2015/12/25/test');
  t.same(nodeRef.toFilePath(), 'acme/article/d9/20/2015__FS__12__FS__25__FS__test');
  t.true(nodeRef.equals(NodeRef.fromFilePath(nodeRef.toFilePath())));
  t.same(`${nodeRef}`, `${NodeRef.fromFilePath(nodeRef.toFilePath())}`);

  nodeRef = NodeRef.fromString('acme-widgets:poll-widget:a:b:C_');
  t.same(nodeRef.toFilePath(), 'acme-widgets/poll-widget/69/a9/a__CLN__b__CLN__C_');
  t.true(nodeRef.equals(NodeRef.fromFilePath(nodeRef.toFilePath())));
  t.same(`${nodeRef}`, `${NodeRef.fromFilePath(nodeRef.toFilePath())}`);

  t.end();
});
