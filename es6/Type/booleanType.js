var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable class-methods-use-this */

import isBoolean from 'lodash-es/isBoolean';
import Type from './Type';
import TypeName from '../Enum/TypeName';

var BooleanType = function (_Type) {
  _inherits(BooleanType, _Type);

  function BooleanType() {
    _classCallCheck(this, BooleanType);

    return _possibleConstructorReturn(this, (BooleanType.__proto__ || Object.getPrototypeOf(BooleanType)).call(this, TypeName.BOOLEAN));
  }

  /**
   * @param {*} value
   * @param {Field} field
   */


  _createClass(BooleanType, [{
    key: 'guard',
    value: function guard(value, field) {
      if (isBoolean(value)) {
        return;
      }

      throw new Error('Field [' + field.getName() + '] expected a boolean, got [' + JSON.stringify(value) + '].');
    }

    /**
     * @param {*} value
     * @param {Field} field
     * @param {Codec} [codec]
     *
     * @return {boolean}
     */

  }, {
    key: 'encode',
    value: function encode(value, field) {
      var codec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      // eslint-disable-line no-unused-vars
      return value;
    }

    /**
     * @param {*} value
     * @param {Field} field
     * @param {Codec} [codec]
     *
     * @return {boolean}
     */

  }, {
    key: 'decode',
    value: function decode(value, field) {
      var codec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      // eslint-disable-line no-unused-vars
      return value;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: 'getDefault',
    value: function getDefault() {
      return false;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: 'isBoolean',
    value: function isBoolean() {
      return true;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: 'allowedInSet',
    value: function allowedInSet() {
      return false;
    }
  }]);

  return BooleanType;
}(Type);

var booleanType = new BooleanType();
Object.freeze(booleanType);
export default booleanType;