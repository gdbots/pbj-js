/* eslint-disable class-methods-use-this */
import Fb from '../../src/FieldBuilder';
import Mixin from '../../src/Mixin';
import SchemaId from '../../src/SchemaId';
import * as T from '../../src/Type';

/** @type SampleMixin */
let instance = null;

export default class SampleMixin extends Mixin {
  /**
   * @returns {SampleMixin}
   */
  static create() {
    if (instance === null) {
      instance = new SampleMixin();
    }

    return instance;
  }

  /**
   * @returns {SchemaId}
   */
  getId() {
    return SchemaId.fromString('pbj:gdbots:pbj.tests::sample-mixin:1-0-0');
  }

  /**
   * @returns {Field[]}
   */
  getFields() {
    return [
      Fb.create('a_string', T.StringType.create())
        .build(),
      Fb.create('a_int', T.IntType.create())
        .build(),
    ];
  }
}
