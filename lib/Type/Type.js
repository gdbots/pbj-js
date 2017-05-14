"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable class-methods-use-this */

var Type = function () {
  /**
   * @param {TypeName} typeName
   */
  function Type(typeName) {
    _classCallCheck(this, Type);

    this.typeName = typeName;
  }

  /**
   * @return {TypeName}
   */


  _createClass(Type, [{
    key: "getTypeName",
    value: function getTypeName() {
      return this.typeName;
    }

    /**
     * @return {string}
     */

  }, {
    key: "getTypeValue",
    value: function getTypeValue() {
      return this.typeName.getValue();
    }

    /**
     * @return {boolean}
     */

  }, {
    key: "isScalar",
    value: function isScalar() {
      return true;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: "encodesToScalar",
    value: function encodesToScalar() {
      return true;
    }

    /**
     * @return {*}
     */

  }, {
    key: "getDefault",
    value: function getDefault() {
      return null;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: "isBoolean",
    value: function isBoolean() {
      return false;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: "isBinary",
    value: function isBinary() {
      return false;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: "isNumeric",
    value: function isNumeric() {
      return false;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: "isString",
    value: function isString() {
      return false;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: "isMessage",
    value: function isMessage() {
      return false;
    }

    /**
     * @return {Integer}
     */

  }, {
    key: "getMin",
    value: function getMin() {
      return -2147483648;
    }

    /**
     * @return {Integer}
     */

  }, {
    key: "getMax",
    value: function getMax() {
      return 2147483647;
    }

    /**
     * @return {Integer}
     */

  }, {
    key: "getMaxBytes",
    value: function getMaxBytes() {
      return 65535;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: "allowedInSet",
    value: function allowedInSet() {
      return true;
    }
  }]);

  return Type;
}();

exports.default = Type;