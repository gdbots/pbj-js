/* eslint-disable class-methods-use-this, no-param-reassign */
import MessageRef from '../../src/MessageRef';

export default function SampleTraitV1(m) {
  /**
   * @param {?string} tag
   *
   * @returns {MessageRef}
   */
  m.prototype.generateMessageRef = function generateMessageRef(tag = null) {
    return new MessageRef(this.schema().getCurie(), this.get('string_single'), tag);
  };

  /**
   * @returns {Object}
   */
  m.prototype.getUriTemplateVars = function getUriTemplateVars() {
    return {
      string_single: this.get('string_single'),
    };
  };
}
