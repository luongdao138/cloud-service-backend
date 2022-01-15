"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refactorClouds = exports.insertLocationData = exports.insertData = exports.crawlData = void 0;

var cheerio = _interopRequireWildcard(require("cheerio"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _User = _interopRequireDefault(require("./models/User.js"));

var _Review = _interopRequireDefault(require("./models/Review.js"));

var _Industry = _interopRequireDefault(require("./models/Industry.js"));

var _CompanySize = _interopRequireDefault(require("./models/CompanySize.js"));

var _Province = _interopRequireDefault(require("./models/Province.js"));

var _District = _interopRequireDefault(require("./models/District.js"));

var _Ward = _interopRequireDefault(require("./models/Ward.js"));

var _JobRole = _interopRequireDefault(require("./models/JobRole.js"));

var _locationData = _interopRequireDefault(require("./locationData.js"));

var _CloudPlatform = _interopRequireDefault(require("./models/CloudPlatform.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var crawlData = function crawlData() {
  var url, res, html, $;
  return regeneratorRuntime.async(function crawlData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          url = 'https://clutch.co/cloud/profile/amazon-web-services-aws#review-74249';
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _nodeFetch["default"])(url));

        case 3:
          res = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(res.text());

        case 6:
          html = _context2.sent;
          $ = cheerio.load(html);
          $('div.views-row').each(function _callee(i, el) {
            var job_title, name, company_industry, company_size, newUser, heading, overall, published_at, rating, newReviewDetail, newReview;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    job_title = $(el).find('.reviewer-col .group-fdb-interview .__relative .field:first-child').text().trim();
                    name = $(el).find('.reviewer-col .group-fdb-interview .__relative .field:nth-child(2)').text().trim();
                    company_industry = $(el).find('.reviewer-col .group-fdb-interview .field-name-field-fdb-user-industry .field-item').text().trim();
                    company_size = $(el).find('.reviewer-col .group-fdb-interview .field-name-field-fdb-company-size .field-item').text().trim();
                    newUser = new _User["default"]({
                      name: name,
                      job_title: job_title,
                      picture_url: 'https://www.clipartmax.com/png/middle/424-4242023_fa-user-circle-icon.png',
                      company: {
                        industry: company_industry,
                        size: company_size
                      }
                    });
                    _context.next = 7;
                    return regeneratorRuntime.awrap(newUser.save());

                  case 7:
                    newUser = _context.sent;
                    heading = $(el).find('.row .project-col h2.smallfont_mobile').text().trim();
                    overall = $(el).find('.row .project-col h2.hidden-xs').text().trim();
                    published_at = $(el).find('.row .project-col h5.date').first().text().trim();
                    rating = Number($(el).find('.row .review-col .field-name-field-fdb-overall-rating p.help-block').text().trim());
                    newReviewDetail = new ReviewDetail({
                      heading: heading,
                      overall: overall,
                      rating: rating
                    });
                    _context.next = 15;
                    return regeneratorRuntime.awrap(newReviewDetail.save());

                  case 15:
                    newReviewDetail = _context.sent;
                    newReview = new _Review["default"]({
                      cloud_platform: '6199a2b119425b127bfbc9d4',
                      review_detail: newReviewDetail._id,
                      user: newUser._id,
                      published_at: published_at,
                      crawl: {
                        web_url: url
                      }
                    });
                    _context.next = 19;
                    return regeneratorRuntime.awrap(newReview.save());

                  case 19:
                    newReview = _context.sent;

                  case 20:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.crawlData = crawlData;
var companySizes = [{
  title: '1-10 employees',
  value: '1-10',
  type: 'small'
}, {
  title: '11-50 employees',
  value: '11-50',
  type: 'small'
}, {
  title: '51-200 employees',
  value: '201-500',
  type: 'small'
}, {
  title: '501-1000 employees',
  value: '501-1000',
  type: 'med'
}, {
  title: '1001-5000 employees',
  value: '1001-5000',
  type: 'med'
}, {
  title: '5001-10.000 employees',
  value: '5001-10000',
  type: 'large'
}, {
  title: '10.000+ employees',
  value: '10000+',
  type: 'large'
}];
var jobroles = [{
  title: 'Account Manager',
  value: 'acm'
}, {
  title: 'Administrative Assistant',
  value: 'ada'
}, {
  title: 'Administrator',
  value: 'adm'
}, {
  title: 'Advisor',
  value: 'adv'
}, {
  title: 'Analyst',
  value: 'ana'
}, {
  title: 'Board Member',
  value: 'bom'
}, {
  title: 'C-Level Executive',
  value: 'cle'
}, {
  title: 'Consultant',
  value: 'cst'
}, {
  title: 'Contributor',
  value: 'ctr'
}, {
  title: 'Director',
  value: 'dir'
}, {
  title: 'Employee',
  value: 'emp'
}, {
  title: 'Engineer',
  value: 'eng'
}, {
  title: 'Former Employee',
  value: 'fem'
}, {
  title: 'General Manager',
  value: 'gma'
}, {
  title: 'Manager',
  value: 'man'
}, {
  title: 'Partner',
  value: 'par'
}, {
  title: 'Program Manager',
  value: 'pma'
}, {
  title: 'Representative',
  value: 'rep'
}, {
  title: 'Project Manager',
  value: 'pja'
}, {
  title: 'Retiree',
  value: 'ret'
}, {
  title: 'Strategist',
  value: 'str'
}, {
  title: 'Supervisor',
  value: 'sup'
}, {
  title: 'Team Lead',
  value: 'tel'
}, {
  title: 'Technician',
  value: 'tec'
}, {
  title: 'Vice-President',
  value: 'vpr'
}];
var industries = [{
  title: 'Accounting',
  value: 'acc'
}, {
  title: 'Airlines/Aviation',
  value: 'air'
}, {
  title: 'Alternative Dispute Resolution',
  value: 'adr'
}, {
  title: 'Alternative Medicine',
  value: 'alm'
}, {
  title: 'Animation',
  value: 'ani'
}, {
  title: 'Apparel & Fashion',
  value: 'app'
}, {
  title: 'Architecture & Planning',
  value: 'arp'
}, {
  title: 'Arts & Crafts',
  value: 'arc'
}, {
  title: 'Automotive',
  value: 'aut'
}, {
  title: 'Banking',
  value: 'bak'
}, {
  title: 'Biotechnology',
  value: 'bit'
}, {
  title: 'Broadcast Media',
  value: 'brm'
}, {
  title: 'Building Meterials',
  value: 'bum'
}, {
  title: 'Business Supplies & Equipment',
  value: 'bse'
}, {
  title: 'Capital Markets',
  value: 'cam'
}, {
  title: 'Chemicals',
  value: 'cme'
}, {
  title: 'Civic & Social Organization',
  value: 'cso'
}, {
  title: 'Civil Engineering',
  value: 'civ'
}, {
  title: 'Commercial Real Estate',
  value: 'cre'
}, {
  title: 'Computer & Network Security',
  value: 'cns'
}, {
  title: 'Computer Games',
  value: 'cog'
}, {
  title: 'Computer Hardware',
  value: 'coh'
}, {
  title: 'Computer Networking',
  value: 'con'
}, {
  title: 'Computer Software',
  value: 'cos'
}, {
  title: 'Construction',
  value: 'cst'
}, {
  title: 'Consumer Electronics',
  value: 'coe'
}, {
  title: 'Consumer Goods',
  value: 'csg'
}, {
  title: 'Computer Services',
  value: 'cps'
}, {
  title: 'Cosmetic',
  value: 'coc'
}, {
  title: 'Defense & Space',
  value: 'des'
}, {
  title: 'Design',
  value: 'deg'
}, {
  title: 'Education Management',
  value: 'edu'
}, {
  title: 'E-Learning',
  value: 'ele'
}, {
  title: 'Electrical & Electronic Manufacturing',
  value: 'eem'
}, {
  title: 'Entertainment',
  value: 'ent'
}, {
  title: 'Environment Services',
  value: 'env'
}, {
  title: 'Events Services',
  value: 'evs'
}, {
  title: 'Executive Office',
  value: 'exo'
}, {
  title: 'Facilities Services',
  value: 'fas'
}, {
  title: 'Farming',
  value: 'far'
}, {
  title: 'Financial Services',
  value: 'fis'
}, {
  title: 'Fishery',
  value: 'fiy'
}, {
  title: 'Fine Art',
  value: 'fia'
}, {
  title: 'Food & Beverages',
  value: 'fob'
}, {
  title: 'Food Production',
  value: 'fop'
}, {
  title: 'Fundraising',
  value: 'fun'
}, {
  title: 'Gambling & Casinos',
  value: 'gam'
}, {
  title: 'Glass, Ceramics & Concrete',
  value: 'gcc'
}, {
  title: 'Goverment Administration',
  value: 'goa'
}, {
  title: 'Graphic Design',
  value: 'grd'
}, {
  title: 'Health, Wellness and Fitness',
  value: 'hwf'
}, {
  title: 'Hospital & Health Care',
  value: 'hhc'
}, {
  title: 'Hostipality',
  value: 'hoy'
}, {
  title: 'Human Resources',
  value: 'hur'
}, {
  title: 'Import & Export',
  value: 'ime'
}, {
  title: 'Individual & Family Services',
  value: 'ifs'
}, {
  title: 'Industrial Automation',
  value: 'ina'
}, {
  title: 'Infomation Technology & Services',
  value: 'its'
}, {
  title: 'Insurance',
  value: 'ine'
}, {
  title: 'International Affairs',
  value: 'iaf'
}, {
  title: 'International Trade & Development',
  value: 'itd'
}, {
  title: 'Internet',
  value: 'itt'
}, {
  title: 'Investment Banking',
  value: 'ivb'
}, {
  title: 'Judiciary',
  value: 'jud'
}, {
  title: 'Law Enforcement',
  value: 'lae'
}, {
  title: 'Law Practice',
  value: 'lop'
}, {
  title: 'Legal Services',
  value: 'les'
}, {
  title: 'Legislative Office',
  value: 'leo'
}, {
  title: 'Leisure, Travel & Tourism',
  value: 'ltt'
}, {
  title: 'Libraries',
  value: 'lib'
}, {
  title: 'Logistic & Supply Chain',
  value: 'lsc'
}, {
  title: 'Luxury Goods & Jewelry',
  value: 'lgj'
}, {
  title: 'Machinery',
  value: 'may'
}, {
  title: 'Management Consulting',
  value: 'mac'
}, {
  title: 'Maritime',
  value: 'mar'
}, {
  title: 'Market Research',
  value: 'mre'
}, {
  title: 'Marketing & Advitising',
  value: 'maa'
}, {
  title: 'Mechanical Or Industrial Engineering',
  value: 'mie'
}, {
  title: 'Media Production',
  value: 'mep'
}, {
  title: 'Medical Device',
  value: 'mdd'
}, {
  title: 'Medical Pratice',
  value: 'mpr'
}, {
  title: 'Military',
  value: 'mil'
}, {
  title: 'Mining & Metals',
  value: 'mim'
}, {
  title: 'Motion Pictures & Film',
  value: 'mpf'
}, {
  title: 'Museum & Institutions',
  value: 'mui'
}, {
  title: 'Music',
  value: 'mus'
}, {
  title: 'Nanotechnology',
  value: 'nan'
}, {
  title: 'Newspapers',
  value: 'nep'
}, {
  title: 'Non-profit Orginazation Management',
  value: 'nom'
}, {
  title: 'Oil & Energy',
  value: 'oie'
}, {
  title: 'Online Media',
  value: 'onm'
}, {
  title: 'Outsoucing/Offshoring',
  value: 'oog'
}, {
  title: 'Package/Freight Delivery',
  value: 'pfd'
}, {
  title: 'Packaging & Containers',
  value: 'pac'
}, {
  title: 'Paper & Forest Products',
  value: 'pfp'
}, {
  title: 'Performing Arts',
  value: 'pea'
}, {
  title: 'Pharmaceuticals',
  value: 'pha'
}, {
  title: 'Philanthropy',
  value: 'phi'
}, {
  title: 'Photography',
  value: 'pho'
}, {
  title: 'Plastics',
  value: 'pla'
}, {
  title: 'Political Organization',
  value: 'poo'
}, {
  title: 'Primary/Secondary Education',
  value: 'pse'
}, {
  title: 'Printing',
  value: 'pri'
}, {
  title: 'Professional Training & Coaching',
  value: 'ptc'
}, {
  title: 'Public Policy',
  value: 'pup'
}, {
  title: 'Public Relations & Communications',
  value: 'prc'
}, {
  title: 'Public Safety',
  value: 'pus'
}, {
  title: 'Publishing',
  value: 'pig'
}, {
  title: 'Railroad Manfacture',
  value: 'ram'
}, {
  title: 'Ranching',
  value: 'ran'
}, {
  title: 'Real Estate',
  value: 'ree'
}, {
  title: 'Recreational Facilities & Services',
  value: 'rfs'
}, {
  title: 'Religious Institutions',
  value: 'rei'
}, {
  title: 'Renewables & Enviroment',
  value: 'ret'
}, {
  title: 'Research',
  value: 'res'
}, {
  title: 'Restaurants',
  value: 'rtr'
}, {
  title: 'Retail',
  value: 'rel'
}, {
  title: 'Security & Investigation',
  value: 'sei'
}, {
  title: 'Semiconductors',
  value: 'sem'
}, {
  title: 'Shipbuilding',
  value: 'shi'
}, {
  title: 'Sporting Goods',
  value: 'spo'
}, {
  title: 'Sports',
  value: 'sps'
}, {
  title: 'Staffing & Recruiting',
  value: 'str'
}, {
  title: 'Telecommunications',
  value: 'tel'
}, {
  title: 'Textiles',
  value: 'tex'
}, {
  title: 'Translation & Localization',
  value: 'trl'
}, {
  title: 'Transportation/Trucking/Railroad',
  value: 'ttr'
}, {
  title: 'Utilities',
  value: 'uti'
}, {
  title: 'Venture Capital & Private Equity',
  value: 'vce'
}, {
  title: 'Veterinary',
  value: 'vet'
}, {
  title: 'Warehousing',
  value: 'war'
}, {
  title: 'Wholesale',
  value: 'who'
}, {
  title: 'Wire and Spirits',
  value: 'was'
}, {
  title: 'Wireless',
  value: 'wir'
}, {
  title: 'Writing & Editing',
  value: 'wre'
}];

var insertData = function insertData() {
  return regeneratorRuntime.async(function insertData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_Industry["default"].insertMany(industries));

        case 2:
          _context3.next = 4;
          return regeneratorRuntime.awrap(_CompanySize["default"].insertMany(companySizes));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(_JobRole["default"].insertMany(jobroles));

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.insertData = insertData;

var insertLocationData = function insertLocationData() {
  var provinces, districts, wards, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

  return regeneratorRuntime.async(function insertLocationData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          provinces = [];
          districts = [];
          wards = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 6;

          _loop = function _loop() {
            var province = _step.value;
            var newPro = {
              name: province.name,
              type: province.type,
              crawl_id: province.level1_id
            };
            var newDis = province.level2s.map(function (item) {
              var newWar = item.level3s.map(function (item2) {
                return {
                  name: item2.name,
                  type: item2.type,
                  district_id: item.level2_id,
                  crawl_id: item2.level3_id
                };
              });
              wards = wards.concat(newWar);
              return {
                name: item.name,
                type: item.type,
                province_id: province.level1_id,
                crawl_id: item.level2_id
              };
            });
            provinces.push(newPro);
            districts = districts.concat(newDis);
          };

          for (_iterator = _locationData["default"].data[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
          }

          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](6);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 15:
          _context4.prev = 15;
          _context4.prev = 16;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 18:
          _context4.prev = 18;

          if (!_didIteratorError) {
            _context4.next = 21;
            break;
          }

          throw _iteratorError;

        case 21:
          return _context4.finish(18);

        case 22:
          return _context4.finish(15);

        case 23:
          _context4.next = 25;
          return regeneratorRuntime.awrap(_Province["default"].insertMany(provinces));

        case 25:
          _context4.next = 27;
          return regeneratorRuntime.awrap(_District["default"].insertMany(districts));

        case 27:
          _context4.next = 29;
          return regeneratorRuntime.awrap(_Ward["default"].insertMany(wards));

        case 29:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[6, 11, 15, 23], [16,, 18, 22]]);
};

exports.insertLocationData = insertLocationData;

var refactorClouds = function refactorClouds() {
  var clouds, promises;
  return regeneratorRuntime.async(function refactorClouds$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(_CloudPlatform["default"].find({}));

        case 3:
          clouds = _context6.sent;
          promises = clouds.map(function _callee2(cloud) {
            var reviews, review_count, rating_distribution, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop2, _iterator2, _step2, totalStars, rating_average;

            return regeneratorRuntime.async(function _callee2$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    console.log(cloud);
                    _context5.next = 3;
                    return regeneratorRuntime.awrap(_Review["default"].find({
                      cloud_platform: cloud._id
                    }));

                  case 3:
                    reviews = _context5.sent;
                    _context5.next = 6;
                    return regeneratorRuntime.awrap(_Review["default"].find({
                      cloud_platform: cloud._id
                    }).countDocuments());

                  case 6:
                    review_count = _context5.sent;
                    rating_distribution = [];
                    _iteratorNormalCompletion2 = true;
                    _didIteratorError2 = false;
                    _iteratorError2 = undefined;
                    _context5.prev = 11;

                    _loop2 = function _loop2() {
                      var review = _step2.value;
                      var d = rating_distribution.find(function (x) {
                        return x.name === review.review_detail.rating.toString();
                      });

                      if (d) {
                        d.count++;
                      } else {
                        rating_distribution.push({
                          name: review.review_detail.rating.toString(),
                          count: 1
                        });
                      }
                    };

                    for (_iterator2 = reviews[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      _loop2();
                    } // const rating_average;


                    _context5.next = 20;
                    break;

                  case 16:
                    _context5.prev = 16;
                    _context5.t0 = _context5["catch"](11);
                    _didIteratorError2 = true;
                    _iteratorError2 = _context5.t0;

                  case 20:
                    _context5.prev = 20;
                    _context5.prev = 21;

                    if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                      _iterator2["return"]();
                    }

                  case 23:
                    _context5.prev = 23;

                    if (!_didIteratorError2) {
                      _context5.next = 26;
                      break;
                    }

                    throw _iteratorError2;

                  case 26:
                    return _context5.finish(23);

                  case 27:
                    return _context5.finish(20);

                  case 28:
                    totalStars = reviews.reduce(function (acc, current) {
                      return acc + current.review_detail.rating;
                    }, 0);
                    rating_average = review_count === 0 ? 0 : totalStars / review_count;
                    rating_average = Number(rating_average.toFixed(2));
                    cloud.stats = {
                      review_count: review_count,
                      rating_average: rating_average,
                      rating_distribution: rating_distribution
                    };
                    _context5.next = 34;
                    return regeneratorRuntime.awrap(cloud.save());

                  case 34:
                    console.log({
                      rating_average: rating_average,
                      rating_distribution: rating_distribution,
                      review_count: review_count
                    });
                    console.log(_typeof(rating_average));
                    return _context5.abrupt("return", cloud);

                  case 37:
                  case "end":
                    return _context5.stop();
                }
              }
            }, null, null, [[11, 16, 20, 28], [21,, 23, 27]]);
          });
          _context6.next = 7;
          return regeneratorRuntime.awrap(Promise.all(promises));

        case 7:
          _context6.next = 12;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.refactorClouds = refactorClouds;