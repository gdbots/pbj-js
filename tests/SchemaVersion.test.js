import test from 'tape';
import SchemaVersion from '../src/SchemaVersion';
import InvalidSchemaVersion from '../src/exceptions/InvalidSchemaVersion';

test('SchemaVersion tests', (t) => {
  const valid = ['1-0-0', '1-1-1', '2-20-0', '300-4000-5000'];
  valid.forEach((version) => {
    try {
      const [major, minor, patch] = version.split('-').map(Number);
      const schemaVersion = SchemaVersion.fromString(version);
      const schemaVersion2 = new SchemaVersion(major, minor, patch);
      t.same(`${schemaVersion}`, `${schemaVersion2}`);
      t.true(schemaVersion instanceof SchemaVersion, 'schemaVersion MUST be an instanceOf SchemaVersion');
      t.same(schemaVersion.toString(), version);
      t.same(schemaVersion.valueOf(), version);
      t.same(schemaVersion.toJSON(), version);
      t.same(`${schemaVersion}`, version);
      t.same(JSON.stringify(schemaVersion), `"${version}"`);
      t.same(schemaVersion.getMajor(), major);
      t.same(schemaVersion.getMinor(), minor);
      t.same(schemaVersion.getPatch(), patch);

      try {
        schemaVersion.test = 1;
        t.fail('schemaVersion instance is mutable');
      } catch (e) {
        t.pass('schemaVersion instance is immutable');
      }
    } catch (e) {
      t.fail(e.message);
    }
  });

  const invalid = [
    'Not A version', '1-0-0.1', '1.0.0', '1-1-1-dev', ' 1-0-0 ', 1, 0, '', null, false, true, {}, [], NaN,
  ];
  invalid.forEach((version) => {
    try {
      const schemaVersion = SchemaVersion.fromString(version);
      t.fail(`SchemaVersion [${schemaVersion}] created with invalid version [${JSON.stringify(version)}].`);
    } catch (e) {
      t.true(e instanceof InvalidSchemaVersion, 'Exception MUST be an instanceOf InvalidSchemaVersion');
      t.pass(e.message);
    }
  });

  t.end();
});
