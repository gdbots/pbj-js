/* eslint-disable class-methods-use-this, no-param-reassign */
import MessageRef from '../../src/MessageRef';

export default function SampleTraitV2(m) {
  return Object.assign(m.prototype, {
    /**
     * @param {?string} tag
     *
     * @returns {MessageRef}
     */
    generateMessageRef(tag = null) {
      return new MessageRef(this.schema().getCurie(), this.get('string_single'), tag);
    },

    /**
     * @returns {Object}
     */
    getUriTemplateVars() {
      return {
        string_single: this.get('string_single'),
      };
    },
  });
}
