'use strict';

import ToArray from 'gdbots/common/to-array';
import ArrayUtils from 'gdbots/common/util/array-utils';
import SystemUtils from 'gdbots/common/util/system-utils';
import FieldAlreadyDefined from 'gdbots/pbj/exception/field-already-defined';
import FieldNotDefined from 'gdbots/pbj/exception/field-not-defined';
import FieldOverrideNotCompatible from 'gdbots/pbj/exception/field-override-not-compatible';
import MixinAlreadyAdded from 'gdbots/pbj/exception/mixin-already-added';
import MixinNotDefined from 'gdbots/pbj/exception/mixin-not-defined';
import SchemaId from 'gdbots/pbj/schema-id';
import FieldBuilder from 'gdbots/pbj/field-builder';
import StringType from 'gdbots/pbj/type/string-type';

export const PBJ_FIELD_NAME = '_schema';

export default class Schema extends SystemUtils.mixinClass(null, ToArray)
{
  /**
   * @param SchemaId|string id
   * @param string          className
   * @param Field[]         fields
   * @param Mixin[]         mixins
   */
  constructor(id, className, fields = [], mixins = []) {
    super(); // require before using `this`

    /** @var string */
    this.id = 'SchemaId' === SystemUtils.getClass(id) ? id : SchemaId.fromString(id);

    /** @var string */
    this.className = className;

    /** @var Mixin[] */
    this.mixins = {};
    this.mixinsByCurie = {}

    /** @var Field[] */
    this.fields = {};
    this.requiredFields = {};

    /** @var string[] */
    this.mixinIds = [];
    this.mixinCuries = [];

    addField.bind(this)(
      FieldBuilder.create(PBJ_FIELD_NAME, StringType.create())
        .isRequired()
        .setPattern(SchemaId.VALID_PATTERN)
        .setDefaultValue(this.id.toString())
        .build()
    );

    ArrayUtils.each(mixins, function(mixin) {
      addMixin.bind(this)(mixin);
    }.bind(this));

    ArrayUtils.each(fields, function(field) {
      addField.bind(this)(field);
    }.bind(this));

    /** @var string[] */
    this.mixinIds = Object.keys(this.mixins);

    /** @var string[] */
    this.mixinCuries = Object.keys(this.mixinsByCurie);
  }

  /**
   * @return string
   */
  toString() {
    return this.id.toString();
  }

  /**
   * @return array
   */
  toArray() {
    return {
      'id': this.id,
      'curie': this.getCurie(),
      'curie_major': this.getCurieMajor(),
      'class_name': this.className,
      'mixins': this.mixins.map(
        function(mixin) {
          return mixin.getId();
        }
      ),
      'fields': this.fields
    };
  }

  /**
   * @return SchemaId
   */
  getId() {
    return this.id;
  }

  /**
   * @return SchemaCurie
   */
  getCurie() {
    return this.id.getCurie();
  }

  /**
   * @see SchemaId::getCurieMajor
   *
   * @return string
   */
  getCurieMajor() {
    return this.id.getCurieMajor();
  }

  /**
   * @return string
   */
  getClassName() {
    return this.className;
  }

  /**
   * Convenience method to return the name of the method that should
   * exist to handle this message.
   *
   * For example, an ImportUserV1 message would be handled by:
   * SomeClass::importUserV1(ImportUserV1 command)
   *
   * @param bool withMajor
   *
   * @return string
   */
  getHandlerMethodName(withMajor = true) {
    if (true === withMajor) {
      return this.classShortName.charAt(0).toLowerCase() + this.classShortName.substr(1);
    }

    let classShortName = this.classShortName.replace('V' + this.id.getVersion().getMajor(), '');
    return classShortName.charAt(0).toLowerCase() + classShortName.substr(1);
  }

  /**
   * @param string fieldName
   *
   * @return bool
   */
  hasField(fieldName) {
    return undefined !== this.fields[fieldName];
  }

  /**
   * @param string fieldName
   *
   * @return Field
   *
   * @throws FieldNotDefined
   */
  getField(fieldName) {
    if (undefined === this.fields[fieldName]) {
      throw new FieldNotDefined(this, fieldName);
    }

    return this.fields[fieldName];
  }

  /**
   * @return Field[]
   */
  getFields() {
    return this.fields;
  }

  /**
   * @return Field[]
   */
  getRequiredFields() {
    return this.requiredFields;
  }

  /**
   * Returns true if the mixin is on this schema. Id provided can be
   * qualified to major rev or just the curie.
   * @see SchemaId::getCurieMajor
   *
   * @param string mixinId
   *
   * @return bool
   */
  hasMixin(mixinId) {
    return undefined !== this.mixins[mixinId] || undefined !== this.mixinsByCurie[mixinId];
  }

  /**
   * @param string mixinId
   *
   * @return Mixin
   *
   * @throws MixinNotDefined
   */
  getMixin(mixinId) {
    if (undefined !== this.mixins[mixinId]) {
      return this.mixins[mixinId];
    }

    if (undefined !== this.mixinsByCurie[mixinId]) {
      return this.mixinsByCurie[mixinId];
    }

    throw new MixinNotDefined(this, mixinId);
  }

  /**
   * @return Mixin[]
   */
  getMixins() {
    return this.mixins;
  }

  /**
   * Returns an array of curies with the major rev.
   * @see SchemaId::getCurieMajor
   *
   * @return array
   */
  getMixinIds() {
    return this.mixinIds;
  }

  /**
   * Returns an array of curies (string version).
   *
   * @return array
   */
  getMixinCuries() {
    return this.mixinCuries;
  }
}

/**
 * @param Field field
 *
 * @throws FieldAlreadyDefined
 * @throws FieldOverrideNotCompatible
 */
function addField(field) {
  let fieldName = field.getName();
  if (this.hasField(fieldName)) {
    let existingField = this.getField(fieldName);
    if (!existingField.isOverridable()) {
      throw new FieldAlreadyDefined(this, fieldName);
    }
    if (!existingField.isCompatibleForOverride(field)) {
      throw new FieldOverrideNotCompatible(this, fieldName, field);
    }
  }

  this.fields[fieldName] = field;
  if (field.isRequired()) {
    this.requiredFields[fieldName] = field;
  }
}

/**
 * @param Mixin mixin
 *
 * @throws MixinAlreadyAdded
 */
function addMixin(mixin) {
  let id = mixin.getId();
  let curieStr = id.getCurie().toString();

  if (undefined !== this.mixinsByCurie[curieStr]) {
    throw new MixinAlreadyAdded(this, this.mixinsByCurie[curieStr], mixin);
  }

  this.mixins[id.getCurieMajor()] = mixin;
  this.mixinsByCurie[curieStr] = mixin;

  ArrayUtils.each(mixin.getFields(), function(field) {
    addField.bind(this)(field);
  }.bind(this));
}
