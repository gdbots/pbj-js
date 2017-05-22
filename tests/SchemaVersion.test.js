import test from 'tape';
import SchemaVersion from '../src/SchemaVersion';
import InvalidSchemaVersion from '../src/Exception/InvalidSchemaVersion';

test('SchemaVersion tests', (assert) => {
  const valid = ['1-0-0', '1-1-1', '2-20-0', '300-4000-5000'];
  valid.forEach((version) => {
    try {
      const [major, minor, patch] = version.split('-').map(Number);
      const schemaVersion = SchemaVersion.fromString(version);
      const schemaVersion2 = new SchemaVersion(major, minor, patch);
      assert.same(`${schemaVersion}`, `${schemaVersion2}`);
      assert.true(schemaVersion instanceof SchemaVersion, 'schemaVersion MUST be an instanceOf SchemaVersion');
      assert.same(schemaVersion.toString(), version);
      assert.same(schemaVersion.valueOf(), version);
      assert.same(schemaVersion.toJSON(), version);
      assert.same(`${schemaVersion}`, version);
      assert.same(JSON.stringify(schemaVersion), `"${version}"`);
      assert.same(schemaVersion.getMajor(), major);
      assert.same(schemaVersion.getMinor(), minor);
      assert.same(schemaVersion.getPatch(), patch);

      try {
        schemaVersion.test = 1;
        assert.fail('schemaVersion instance is mutable');
      } catch (e) {
        assert.pass('schemaVersion instance is immutable');
      }
    } catch (e) {
      assert.fail(e.message);
    }
  });

  const invalid = [
    'Not A version', '1-0-0.1', '1.0.0', '1-1-1-dev', ' 1-0-0 ', 1, 0, '', null, false, true, {}, [], NaN,
  ];
  invalid.forEach((version) => {
    try {
      const schemaVersion = SchemaVersion.fromString(version);
      assert.fail(`SchemaVersion [${schemaVersion}] created with invalid version [${JSON.stringify(version)}].`);
    } catch (e) {
      assert.true(e instanceof InvalidSchemaVersion, 'Exception MUST be an instanceOf InvalidSchemaVersion');
      assert.pass(e.message);
    }
  });

  assert.end();
});
