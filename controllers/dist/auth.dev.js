"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _User = _interopRequireDefault(require("../models/User.js"));

var _BadRequestError = require("../errors/BadRequestError.js");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _googleAuthLibrary = require("google-auth-library");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var client = new _googleAuthLibrary.OAuth2Client('290912695082-5v9jqpb177cvnvtcpv3q30sb29s1flal.apps.googleusercontent.com');
var authController = {
  login: function login(req, res) {
    var _req$body, email, password, user, isPwCorrect, token, newUser;

    return regeneratorRuntime.async(function login$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, email = _req$body.email, password = _req$body.password;
            console.log({
              email: email,
              password: password
            }); // validate email, password
            // check if email  exists

            _context.next = 4;
            return regeneratorRuntime.awrap(_User["default"].findOne({
              email: email
            }));

          case 4:
            user = _context.sent;

            if (user) {
              _context.next = 7;
              break;
            }

            throw new _BadRequestError.BadRequestError('Email or password is not correct!');

          case 7:
            _context.next = 9;
            return regeneratorRuntime.awrap(_bcryptjs["default"].compare(password, user.password));

          case 9:
            isPwCorrect = _context.sent;

            if (isPwCorrect) {
              _context.next = 12;
              break;
            }

            throw new _BadRequestError.BadRequestError('Email or password is not correct!');

          case 12:
            // generate token
            token = _jsonwebtoken["default"].sign({
              _id: user._id
            }, process.env.ACCESS_TOKEN);
            newUser = _objectSpread({}, user._doc);
            delete newUser.password;
            setTimeout(function () {
              return res.status(201).json({
                user: newUser,
                token: token
              });
            }, 2000);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  signup: function signup(req, res) {
    var _req$body2, email, password, name, user, salt, hashedPassword, newUser, token;

    return regeneratorRuntime.async(function signup$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password, name = _req$body2.name; // validate req.body
            // check if email already exists

            _context2.next = 3;
            return regeneratorRuntime.awrap(_User["default"].findOne({
              email: email
            }));

          case 3:
            user = _context2.sent;

            if (!user) {
              _context2.next = 6;
              break;
            }

            throw new _BadRequestError.BadRequestError('Email alread exists, choose another email!');

          case 6:
            _context2.next = 8;
            return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt());

          case 8:
            salt = _context2.sent;
            _context2.next = 11;
            return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, salt));

          case 11:
            hashedPassword = _context2.sent;
            // create new user
            newUser = new _User["default"]({
              email: email,
              name: name,
              password: hashedPassword
            });
            _context2.next = 15;
            return regeneratorRuntime.awrap(newUser.save());

          case 15:
            newUser = _context2.sent;
            // generate token
            token = _jsonwebtoken["default"].sign({
              _id: newUser._id
            }, process.env.ACCESS_TOKEN);
            newUser = _objectSpread({}, newUser._doc);
            delete newUser.password;
            setTimeout(function () {
              return res.status(201).json({
                user: newUser,
                token: token
              });
            }, 2000);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  googlelogin: function googlelogin(req, res) {
    var idToken, data, _data$payload, email, email_verified, name, picture, user, token, newUser, password, salt, hashedPassword, _newUser, _token;

    return regeneratorRuntime.async(function googlelogin$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            idToken = req.body.idToken;

            if (idToken) {
              _context3.next = 3;
              break;
            }

            throw new _BadRequestError.BadRequestError('Id token is required!');

          case 3:
            _context3.next = 5;
            return regeneratorRuntime.awrap(client.verifyIdToken({
              idToken: idToken,
              audience: '290912695082-3ekhf56e8hr53flpvo53gma2ql5d51e4.apps.googleusercontent.com'
            }));

          case 5:
            data = _context3.sent;
            _data$payload = data.payload, email = _data$payload.email, email_verified = _data$payload.email_verified, name = _data$payload.name, picture = _data$payload.picture;
            _context3.next = 9;
            return regeneratorRuntime.awrap(_User["default"].findOne({
              email: email
            }));

          case 9:
            user = _context3.sent;

            if (!user) {
              _context3.next = 17;
              break;
            }

            token = _jsonwebtoken["default"].sign({
              _id: user._id
            }, process.env.ACCESS_TOKEN);
            newUser = _objectSpread({}, user._doc);
            delete newUser.password;
            return _context3.abrupt("return", res.json({
              token: token,
              user: newUser
            }));

          case 17:
            password = email + process.env.ACCESS_TOKEN;
            _context3.next = 20;
            return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt());

          case 20:
            salt = _context3.sent;
            _context3.next = 23;
            return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, salt));

          case 23:
            hashedPassword = _context3.sent;
            _newUser = new _User["default"]({
              name: name,
              email: email,
              password: hashedPassword,
              picture_url: picture
            });
            _context3.next = 27;
            return regeneratorRuntime.awrap(_newUser.save());

          case 27:
            _newUser = _context3.sent;
            // generate token
            _token = _jsonwebtoken["default"].sign({
              _id: _newUser._id
            }, process.env.ACCESS_TOKEN);
            _newUser = _objectSpread({}, _newUser._doc);
            delete _newUser.password;
            return _context3.abrupt("return", res.status(201).json({
              user: _newUser,
              token: _token
            }));

          case 32:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};
var _default = authController;
exports["default"] = _default;