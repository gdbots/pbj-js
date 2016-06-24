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

/**
 * Holds private properties
 *
 * @var WeakMap
 */
let privateProps = new WeakMap();

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

    privateProps.set(this, {
      /** @var string */
      id: 'SchemaId' === SystemUtils.getClass(id) ? id : SchemaId.fromString(id),

      /** @var string */
      className: className,

      /** @var Mixin[] */
      mixins: {},
      mixinsByCurie: {},

      /** @var Field[] */
      fields: {},
      requiredFields: {},

      /** @var string[] */
      mixinIds: [],
      mixinCuries: []
    });

    addField.bind(this)(
      FieldBuilder.create(PBJ_FIELD_NAME, StringType.create())
        .required()
        .pattern(SchemaId.VALID_PATTERN)
        .withDefault(privateProps.get(this).id.toString())
        .build()
    );

    ArrayUtils.each(mixins, function(mixin) {
      addMixin.bind(this)(mixin);
    }.bind(this));

    ArrayUtils.each(fields, function(field) {
      addField.bind(this)(field);
    }.bind(this));

    /** @var string[] */
    privateProps.get(this).mixinIds = Object.keys(privateProps.get(this).mixins);

    /** @var string[] */
    privateProps.get(this).mixinCuries = Object.keys(privateProps.get(this).mixinsByCurie);
  }

  /**
   * @return string
   */
  toString() {
    return privateProps.get(this).id.toString();
  }

  /**
   * @return array
   */
  toArray() {
    return {
      'id': privateProps.get(this).id,
      'curie': this.getCurie(),
      'curie_major': this.getCurieMajor(),
      'class_name': privateProps.get(this).className,
      'mixins': privateProps.get(this).mixins.map(
        function(mixin) {
          return mixin.getId();
        }
      ),
      'fields': privateProps.get(this).fields
    };
  }

  /**
   * @return SchemaId
   */
  getId() {
    return privateProps.get(this).id;
  }

  /**
   * @return SchemaCurie
   */
  getCurie() {
    return privateProps.get(this).id.getCurie();
  }

  /**
   * @see SchemaId::getCurieMajor
   *
   * @return string
   */
  getCurieMajor() {
    return privateProps.get(this).id.getCurieMajor();
  }

  /**
   * @return string
   */
  getClassName() {
    return privateProps.get(this).className;
  }

  /**
   * @param string fieldName
   *
   * @return bool
   */
  hasField(fieldName) {
    return undefined !== privateProps.get(this).fields[fieldName];
  }

  /**
   * @param string fieldName
   *
   * @return Field
   *
   * @throws FieldNotDefined
   */
  getField(fieldName) {
    if (undefined === privateProps.get(this).fields[fieldName]) {
      throw new FieldNotDefined(this, fieldName);
    }

    return privateProps.get(this).fields[fieldName];
  }

  /**
   * @return Field[]
   */
  getFields() {
    return privateProps.get(this).fields;
  }

  /**
   * @return Field[]
   */
  getRequiredFields() {
    return privateProps.get(this).requiredFields;
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
    return undefined !== privateProps.get(this).mixins[mixinId] || undefined !== privateProps.get(this).mixinsByCurie[mixinId];
  }

  /**
   * @param string mixinId
   *
   * @return Mixin
   *
   * @throws MixinNotDefined
   */
  getMixin(mixinId) {
    if (undefined !== privateProps.get(this).mixins[mixinId]) {
      return privateProps.get(this).mixins[mixinId];
    }

    if (undefined !== privateProps.get(this).mixinsByCurie[mixinId]) {
      return privateProps.get(this).mixinsByCurie[mixinId];
    }

    throw new MixinNotDefined(this, mixinId);
  }

  /**
   * @return Mixin[]
   */
  getMixins() {
    return privateProps.get(this).mixins;
  }

  /**
   * Returns an array of curies with the major rev.
   * @see SchemaId::getCurieMajor
   *
   * @return array
   */
  getMixinIds() {
    return privateProps.get(this).mixinIds;
  }

  /**
   * Returns an array of curies (string version).
   *
   * @return array
   */
  getMixinCuries() {
    return privateProps.get(this).mixinCuries;
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

  privateProps.get(this).fields[fieldName] = field;
  if (field.isRequired()) {
    privateProps.get(this).requiredFields[fieldName] = field;
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

  if (undefined !== privateProps.get(this).mixinsByCurie[curieStr]) {
    throw new MixinAlreadyAdded(this, privateProps.get(this).mixinsByCurie[curieStr], mixin);
  }

  privateProps.get(this).mixins[id.getCurieMajor()] = mixin;
  privateProps.get(this).mixinsByCurie[curieStr] = mixin;

  ArrayUtils.each(mixin.getFields(), function(field) {
    addField.bind(this)(field);
  }.bind(this));
}
