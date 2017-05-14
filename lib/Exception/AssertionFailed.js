"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssertionFailed = function (_Error) {
  _inherits(AssertionFailed, _Error);

  function AssertionFailed() {
    _classCallCheck(this, AssertionFailed);

    return _possibleConstructorReturn(this, (AssertionFailed.__proto__ || Object.getPrototypeOf(AssertionFailed)).apply(this, arguments));
  }

  return AssertionFailed;
}(Error);

exports.default = AssertionFailed;