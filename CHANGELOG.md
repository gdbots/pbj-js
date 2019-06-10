# CHANGELOG


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
