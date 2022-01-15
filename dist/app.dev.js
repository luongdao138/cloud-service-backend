"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _connectDB = _interopRequireDefault(require("./database/connectDB.js"));

require("express-async-errors");

var _notFoundMiddleware = _interopRequireDefault(require("./middlewares/notFoundMiddleware.js"));

var _errorHandler = _interopRequireDefault(require("./middlewares/errorHandler.js"));

var _crawl = _interopRequireDefault(require("./routes/crawl.js"));

var _clouds = _interopRequireDefault(require("./routes/clouds.js"));

var _stats = _interopRequireDefault(require("./routes/stats.js"));

var _auth = _interopRequireDefault(require("./routes/auth.js"));

var _user = _interopRequireDefault(require("./routes/user.js"));

var _location = _interopRequireDefault(require("./routes/location.js"));

var _review = _interopRequireDefault(require("./routes/review.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// routes
// import { refactorClouds } from './crawlData.js';
_dotenv["default"].config();

var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _cors["default"])({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:5500']
}));
console.log(process.env.CLOUD_API_KEY);
app.get('/', function (req, res) {
  return res.json({
    message: 'Hello cloud service'
  });
}); // apply route middlewares

app.use('/api/v1/crawl', _crawl["default"]);
app.use('/api/v1/clouds', _clouds["default"]);
app.use('/api/v1/stats', _stats["default"]);
app.use('/api/v1/auth', _auth["default"]);
app.use('/api/v1/users', _user["default"]);
app.use('/api/v1/location', _location["default"]);
app.use('/api/v1/reviews', _review["default"]);
app.use('*', _notFoundMiddleware["default"]);
app.use(_errorHandler["default"]);
var PORT = process.env.PORT || 5000;

var start = function start() {
  return regeneratorRuntime.async(function start$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connectDB["default"])(process.env.MONGODB_URI));

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(app.listen(PORT));

        case 5:
          console.log("server listening on port ".concat(PORT));
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          process.exit(1);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

start();