"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

require("./login.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Login = function (_React$Component) {
  _inherits(Login, _React$Component);

  function Login() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Login);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Login.__proto__ || Object.getPrototypeOf(Login)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      email: "",
      otp: "",
      showOtp: false
    }, _this.handleInput = function (e) {
      var input = e.target;
      _this.setState(_defineProperty({}, input.name, input.value));
    }, _this.handleSubmit = function (e) {
      e.preventDefault();
      if (_this.state.showOtp) {
        fetch("http://localhost:3000/submit_otp", {
          method: "POST",
          credentials: "include",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            otp: _this.state.otp,
            email: _this.state.email
          })
        }).then(function (res) {
          return res.json();
        }).then(function (data) {
          if (data.msg) {
            _this.props.history.replace('/chat');
          } else {
            alert("Error");
          }
          _this.setState({
            showOtp: false
          });
        });
      } else {
        fetch("http://localhost:3000/otp?email=" + _this.state.email).then(function (res) {
          return res.json();
        }).then(function (data) {
          if (data.user_exist) {
            _this.setState({
              showOtp: true
            });
          } else if (data.image) {
            _this.setState({
              qrImage: data.image,
              showOtp: true
            });
          }
        });
      }
    }, _this.generateQRCode = function () {
      fetch("http://localhost:3000/generate_qr_code?email=" + _this.state.email).then(function (res) {
        return res.json();
      }).then(function (data) {
        _this.setState({
          qrImage: data.image,
          showOtp: true
        });
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Login, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "login-modal" },
        _react2.default.createElement(
          "div",
          { className: "login-form" },
          _react2.default.createElement(
            "h1",
            null,
            "Congratulations, welcome on board!"
          ),
          _react2.default.createElement(
            "form",
            { onSubmit: this.handleSubmit },
            this.state.showOtp ? _react2.default.createElement("input", {
              key: "otp",
              placeholder: "Enter otp",
              type: "text",
              name: "otp",
              onChange: this.handleInput
            }) : _react2.default.createElement("input", {
              key: "email",
              type: "text",
              name: "email",
              placeholder: "Enter email id",
              value: this.state.email,
              onChange: this.handleInput
            }),
            _react2.default.createElement(
              "a",
              { onClick: this.generateQRCode },
              "Generate QR code again"
            ),
            _react2.default.createElement(
              "button",
              null,
              "Submit"
            )
          ),
          _react2.default.createElement(
            "div",
            { className: "footer" },
            "Copyright Zoomcar"
          )
        ),
        _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement("img", { src: this.state.qrImage })
        ),
        _react2.default.createElement(
          "div",
          { className: "login-splash" },
          _react2.default.createElement("img", { src: require("assets/img/loginImg.jpg") })
        )
      );
    }
  }]);

  return Login;
}(_react2.default.Component);

Login.propTypes = {
  name: _propTypes2.default.string
};

Login.defaultProps = {};

exports.default = Login;