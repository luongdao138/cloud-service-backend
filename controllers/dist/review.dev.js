"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BadRequestError = require("../errors/BadRequestError.js");

var _CloudPlatform = _interopRequireDefault(require("../models/CloudPlatform.js"));

var _Review = _interopRequireDefault(require("../models/Review.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  addReview: function addReview(req, res) {
    var user, review, cloud, oldStats, isFound, totalRating, totalStars, rating_average;
    return regeneratorRuntime.async(function addReview$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = req.user;
            _context.next = 3;
            return regeneratorRuntime.awrap(_Review["default"].findOne({
              user: user._id,
              cloud_platform: req.body.cloud_platform
            }));

          case 3:
            review = _context.sent;

            if (!review) {
              _context.next = 6;
              break;
            }

            throw new _BadRequestError.BadRequestError("You've already reviewed this cloud service!");

          case 6:
            _context.next = 8;
            return regeneratorRuntime.awrap(_CloudPlatform["default"].findById(req.body.cloud_platform));

          case 8:
            cloud = _context.sent;

            if (cloud) {
              _context.next = 11;
              break;
            }

            throw new _BadRequestError.BadRequestError('Cloud does not exist!');

          case 11:
            review = new _Review["default"](_objectSpread({}, req.body, {
              user: user._id
            }));
            _context.next = 14;
            return regeneratorRuntime.awrap(review.save());

          case 14:
            review = _context.sent;
            // cập nhật lại cloud
            oldStats = cloud.stats;
            console.log(oldStats);
            oldStats.review_count++;
            isFound = false;
            oldStats.rating_distribution = oldStats.rating_distribution.map(function (x) {
              if (x.name === review.review_detail.rating.toString()) {
                x.count++;
                isFound = true;
              }

              return x;
            });
            if (!isFound) oldStats.rating_distribution.push({
              name: review.review_detail.rating.toString(),
              count: 1
            });
            totalRating = oldStats.review_count;
            totalStars = oldStats.rating_distribution.reduce(function (acc, current) {
              return acc + Number(current.name) * current.count;
            }, 0);
            rating_average = totalStars / totalRating;
            oldStats.rating_average = Number(rating_average.toFixed(2));
            cloud.stats = oldStats;
            _context.next = 28;
            return regeneratorRuntime.awrap(cloud.save());

          case 28:
            return _context.abrupt("return", res.status(201).json({
              review: review
            }));

          case 29:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  getReviewsOfUser: function getReviewsOfUser(req, res) {
    var user, reviews;
    return regeneratorRuntime.async(function getReviewsOfUser$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            user = req.user;
            _context2.next = 3;
            return regeneratorRuntime.awrap(_Review["default"].find({
              user: user._id
            }).populate({
              path: 'cloud_platform',
              model: _CloudPlatform["default"],
              select: '_id name logo'
            }));

          case 3:
            reviews = _context2.sent;
            return _context2.abrupt("return", res.json({
              reviews: reviews
            }));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  deleteReview: function deleteReview(req, res) {
    var user, id, review, cloud, oldStats, totalRating, totalStars, rating_average;
    return regeneratorRuntime.async(function deleteReview$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            user = req.user;
            id = req.params.id;
            _context3.next = 4;
            return regeneratorRuntime.awrap(_Review["default"].findById(id));

          case 4:
            review = _context3.sent;

            if (review) {
              _context3.next = 7;
              break;
            }

            throw new _BadRequestError.BadRequestError('Cloud service not found!');

          case 7:
            if (!(user._id.toString() !== review.user.toString())) {
              _context3.next = 9;
              break;
            }

            throw new _BadRequestError.BadRequestError('Action not allowed!');

          case 9:
            _context3.next = 11;
            return regeneratorRuntime.awrap(_CloudPlatform["default"].findById(review.cloud_platform));

          case 11:
            cloud = _context3.sent;
            oldStats = cloud.stats;
            oldStats.review_count--;
            oldStats.rating_distribution = oldStats.rating_distribution.map(function (x) {
              if (x.name === review.review_detail.rating.toString()) {
                x.count--;
              }

              return x;
            });
            totalRating = oldStats.review_count;
            totalStars = oldStats.rating_distribution.reduce(function (acc, current) {
              return acc + Number(current.name) * current.count;
            }, 0);
            rating_average = totalRating === 0 ? 0 : totalStars / totalRating;
            oldStats.rating_average = Number(rating_average.toFixed(2));
            cloud.stats = oldStats;
            _context3.next = 22;
            return regeneratorRuntime.awrap(cloud.save());

          case 22:
            _context3.next = 24;
            return regeneratorRuntime.awrap(_Review["default"].findByIdAndDelete(id));

          case 24:
            return _context3.abrupt("return", res.json({
              msg: 'Success'
            }));

          case 25:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  getReviewDetail: function getReviewDetail(req, res) {
    var id, review;
    return regeneratorRuntime.async(function getReviewDetail$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            _context4.next = 3;
            return regeneratorRuntime.awrap(_Review["default"].findById(id));

          case 3:
            review = _context4.sent;

            if (review) {
              _context4.next = 6;
              break;
            }

            throw new _BadRequestError.BadRequestError('Cloud service not found!');

          case 6:
            return _context4.abrupt("return", res.json({
              review: review
            }));

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  updateReview: function updateReview(req, res) {
    var id, user, review, cloud, oldRating, oldStats, isFound, totalRating, totalStars, rating_average;
    return regeneratorRuntime.async(function updateReview$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            user = req.user;
            _context5.next = 4;
            return regeneratorRuntime.awrap(_Review["default"].findById(id));

          case 4:
            review = _context5.sent;

            if (review) {
              _context5.next = 7;
              break;
            }

            throw new _BadRequestError.BadRequestError('Cloud service not found!');

          case 7:
            _context5.next = 9;
            return regeneratorRuntime.awrap(_CloudPlatform["default"].findById(review.cloud_platform));

          case 9:
            cloud = _context5.sent;

            if (!(user._id.toString() !== review.user.toString())) {
              _context5.next = 12;
              break;
            }

            throw new _BadRequestError.BadRequestError('Action not allowed!');

          case 12:
            oldRating = review.review_detail.rating;
            _context5.next = 15;
            return regeneratorRuntime.awrap(_Review["default"].findByIdAndUpdate(id, req.body, {
              "new": true
            }));

          case 15:
            review = _context5.sent;
            oldStats = cloud.stats;
            isFound = false;
            oldStats.rating_distribution = oldStats.rating_distribution.map(function (x) {
              if (x.name === review.review_detail.rating.toString()) {
                x.count++;
                isFound = true;
              }

              if (x.name === oldRating.toString()) {
                x.count--;
              }

              return x;
            });
            if (!isFound) oldStats.rating_distribution.push({
              name: review.review_detail.rating.toString(),
              count: 1
            });
            totalRating = oldStats.review_count;
            totalStars = oldStats.rating_distribution.reduce(function (acc, current) {
              return acc + Number(current.name) * current.count;
            }, 0);
            rating_average = totalStars / totalRating;
            oldStats.rating_average = Number(rating_average.toFixed(2));
            cloud.stats = oldStats;
            _context5.next = 27;
            return regeneratorRuntime.awrap(cloud.save());

          case 27:
            return _context5.abrupt("return", res.json({
              review: review
            }));

          case 28:
          case "end":
            return _context5.stop();
        }
      }
    });
  }
};
exports["default"] = _default;