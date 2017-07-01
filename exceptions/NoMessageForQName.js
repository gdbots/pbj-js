import LogicException from './LogicException';

export default class NoMessageForQName extends LogicException {
  /**
   * @param {SchemaQName} qname
   */
  constructor(qname) {
    super(`MessageResolver is unable to resolve [${qname}] to a SchemaCurie.`);
    this.qname = qname;
  }

  /**
   * @returns {SchemaQName}
   */
  getQName() {
    return this.qname;
  }
}