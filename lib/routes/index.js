"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Routes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require("react-router-dom");

var _init = require("src/pages/init");

var _init2 = _interopRequireDefault(_init);

var _home = require("src/pages/home");

var _home2 = _interopRequireDefault(_home);

var _login = require("src/pages/login");

var _login2 = _interopRequireDefault(_login);

var _chat = require("src/pages/chat");

var _chat2 = _interopRequireDefault(_chat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Routes = exports.Routes = function (_React$Component) {
  _inherits(Routes, _React$Component);

  function Routes() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Routes);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Routes.__proto__ || Object.getPrototypeOf(Routes)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loading: true
    }, _this.handlePageFinish = function (data, history) {
      _this.setState({ loading: false });
      if (data.status) {
        history.replace("/chat");
      } else {
        history.replace("/login");
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Routes, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        _reactRouterDom.BrowserRouter,
        null,
        _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement(_reactRouterDom.Route, {
            path: "/",
            render: function render(props) {
              return _react2.default.createElement(_init2.default, _extends({ onFinish: _this2.handlePageFinish }, props));
            }
          }),
          !this.state.loading ? _react2.default.createElement(
            "div",
            null,
            _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: "/", component: _home2.default }),
            _react2.default.createElement(_reactRouterDom.Route, { path: "/login", component: _login2.default }),
            _react2.default.createElement(_reactRouterDom.Route, { path: "/chat", component: _chat2.default })
          ) : _react2.default.createElement(
            "span",
            null,
            "Loading..."
          )
        )
      );
    }
  }]);

  return Routes;
}(_react2.default.Component);

exports.default = Routes;