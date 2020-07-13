# CHANGELOG


## v2.0.1
* Handle async imports in MessageResolver correctly for truly lazy loaded schemas. `import(...)` vs `() => import(...)`.


## v2.0.0
__BREAKING CHANGES__

* Moves `@gdbots/pbj/MessageRef` to `@gdbots/pbj/well-known/MessageRef`
* Adds implementation for new `node-ref` type with `@gdbots/pbj/types/NodeRefType` and `@gdbots/pbj/well-known/NodeRef`
* All message resolution and deserialization/unmarshalling is now async so schemas can be lazy loaded.
* Removes `Mixin` since the `gdbots/pbjc` no longer uses them.
* Changes `MessageResolver.findOneUsingMixin` and `MessageResolver.findAllUsingMixin` to use a curie (string) for resolution and instead of returning the schema it just returns curies (strings) of the messages using the mixin and is also async.
* Simplifies `Schema` so the mixins are just the curies in string form, not objects.
* Removes use of `@gdbots/common` lib as those utils are now move to this lib `@gdbots/pbj/utils/*`.


## v1.0.1
* Guard against value's constructor name instead of instanceof in `IdentifierType`.
* Guard against value's `getEnumId` value instead of instanceof in `IntEnumType` and `StringEnumType`.


## v1.0.0
* Tag first stable version.


## v0.2.6
* Allow `IdentifierType` to be 255 bytes, same as `StringType`.


## v0.2.5
* When setting a field to null or undefined, clear it.


## v0.2.4
* Apply same guard rules for all string types so format and pattern are enforced. This is needed because it is very common to need a text field type for a URL due to sizes often being greater than 255 bytes.


## v0.2.3
* Another round of npm upgrades to REALLY get the major bumps this time.


## v0.2.2
* Update `peerDependencies` to allow utf8 package versions `^2.1.2 || ^3.0.0`.


## v0.2.1
* issue #7: Create shortcut in Mixin for findOne and findAll.


## v0.2.0
* issue #3: Create DynamoDb item marshaler for converting pbj to and from DynamoDb json format.


## v0.1.2
* issue #4: BUG :: MessageType guard doesn't check mixin curies.


## v0.1.1
* Publishing to 0.1.1 as 0.1.0 was published in error when package was originally created.


## v0.1.0
* initial version
