var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Field = function () {
  /**
   * @param {string} name
   * @param {Type} type
   */
  function Field(name, type) {
    _classCallCheck(this, Field);

    this.name = name;
    this.type = type;
  }

  /**
   * @return {string}
   */


  _createClass(Field, [{
    key: "getName",
    value: function getName() {
      return this.name;
    }

    /**
     * @return {Type}
     */

  }, {
    key: "getType",
    value: function getType() {
      return this.type;
    }
  }]);

  return Field;
}();

export default Field;