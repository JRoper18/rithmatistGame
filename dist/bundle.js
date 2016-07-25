/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var _canvas = __webpack_require__(1);

	var _canvas2 = _interopRequireDefault(_canvas);

	var _board = __webpack_require__(7);

	var _board2 = _interopRequireDefault(_board);

	var _circle = __webpack_require__(9);

	var _circle2 = _interopRequireDefault(_circle);

	var _runeData = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	console.log('hello world from ' + __dirname);

	var b = new _board2.default('#content');
	var c = new _canvas2.default(b, ["circle", "attack"]);
	var i = 0;
	setInterval(function () {
	  var svgElements = "<svg width='100%' height='100%'>" + b.render() + c.render() + "</svg>";
	  $(b.Element).empty();
	  $(b.Element).append(svgElements);
	  debugger;
	}, 30);
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _recognizer = __webpack_require__(2);

	var _recognizer2 = _interopRequireDefault(_recognizer);

	var _runeData = __webpack_require__(6);

	var _board = __webpack_require__(7);

	var _board2 = _interopRequireDefault(_board);

	var _rune = __webpack_require__(8);

	var _rune2 = _interopRequireDefault(_rune);

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Canvas = function () {
	  function Canvas(board, runes) {
	    _classCallCheck(this, Canvas);

	    this.Board = board;
	    this.Runes = runes;
	    this.CurrentRune = new _rune2.default([]);
	    var self = this;
	    var strokeId = 1;
	    var recognizer = new _recognizer2.default();
	    (0, _runeData.getUserRunes)(recognizer, runes);
	    var DOM = this.Board.Element;
	    $(DOM).on("mousedown", function (mouseDownEvent) {
	      $(DOM).on("mousemove", function (mouseMoveEvent) {
	        var parentOffset = $(DOM).offset();
	        //Offset allows for containers that don't fit thte entire page and work inside the surface.
	        var relX = mouseMoveEvent.pageX - parentOffset.left;
	        var relY = mouseMoveEvent.pageY - parentOffset.top;

	        //Add the new point data
	        self.CurrentRune.Points.push(new _point2.default(relX, relY, strokeId));
	      });
	    });
	    $(DOM).on("mouseup", function () {
	      $(DOM).off("mousemove");
	      var recognizedResult = recognizer.Recognize(self.CurrentRune.Points);
	      //WARNING Recognize adds 99-98 more randon points to a point array, which is why I made a clone of of the points and then recognized the clone.
	      if (recognizedResult.Score > 0.5) {
	        //If they just drew something
	        self.Board.newRune(recognizedResult.Name, self.CurrentRune.Points);
	        self.CurrentRune = new _rune2.default([]);
	      }
	      strokeId++;
	      self.LastStroke = new _rune2.default([]);
	    });
	  }

	  _createClass(Canvas, [{
	    key: 'render',
	    value: function render() {
	      var path = this.CurrentRune.render();
	      return path;
	    }
	  }]);

	  return Canvas;
	}();

	exports.default = Canvas;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _coord = __webpack_require__(3);

	var coord = _interopRequireWildcard(_coord);

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	var _pointcloud = __webpack_require__(5);

	var _pointcloud2 = _interopRequireDefault(_pointcloud);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var NumPointClouds = 0;
	var NumPoints = 32;
	var Origin = new _point2.default(0, 0, 0);

	var Result // constructor
	= function Result(name, score) {
		_classCallCheck(this, Result);

		this.Name = name;
		this.Score = score;
	};

	var PDollarRecognizer = function () {
		function PDollarRecognizer(PointClouds) {
			_classCallCheck(this, PDollarRecognizer);

			this.PointClouds = new Array(0);
		}

		//
		// The $P Point-Cloud Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), DeleteUserGestures()
		//


		_createClass(PDollarRecognizer, [{
			key: 'Recognize',
			value: function Recognize(pointsInput) {
				var points = pointsInput;
				points = coord.Resample(points, NumPoints);
				points = coord.Scale(points);
				points = coord.TranslateTo(points, Origin);

				var b = +Infinity;
				var u = -1;
				for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
				{
					var d = coord.GreedyCloudMatch(points, this.PointClouds[i]);
					if (d < b) {
						b = d; // best (least) distance
						u = i; // point-cloud
					}
				}
				return u == -1 ? new Result("No match.", 0.0) : new Result(this.PointClouds[u].Name, Math.max((b - 2.0) / -2.0, 0.0));
			}
		}, {
			key: 'AddGesture',
			value: function AddGesture(name, points) {
				this.PointClouds[this.PointClouds.length] = new _pointcloud2.default(name, points);
				var num = 0;
				for (var i = 0; i < this.PointClouds.length; i++) {
					if (this.PointClouds[i].Name == name) num++;
				}
				return num;
			}
		}, {
			key: 'DeleteUserGestures',
			value: function DeleteUserGestures() {
				this.PointClouds.length = NumPointClouds; // clear any beyond the original set
				return NumPointClouds;
			}
		}]);

		return PDollarRecognizer;
	}();

	exports.default = PDollarRecognizer;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.CloudDistance = exports.Resample = exports.Scale = exports.TranslateTo = exports.GreedyCloudMatch = exports.Centroid = exports.PathDistance = exports.PathLength = exports.Distance = undefined;

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * The $P Point-Cloud Recognizer (JavaScript version)
	 *
	 * 	Radu-Daniel Vatavu, Ph.D.
	 *	University Stefan cel Mare of Suceava
	 *	Suceava 720229, Romania
	 *	vatavu@eed.usv.ro
	 *
	 *	Lisa Anthony, Ph.D.
	 *      UMBC
	 *      Information Systems Department
	 *      1000 Hilltop Circle
	 *      Baltimore, MD 21250
	 *      lanthony@umbc.edu
	 *
	 *	Jacob O. Wobbrock, Ph.D.
	 * 	The Information School
	 *	University of Washington
	 *	Seattle, WA 98195-2840
	 *	wobbrock@uw.edu
	 *
	 * The academic publication for the $P recognizer, and what should be
	 * used to cite it, is:
	 *
	 *	Vatavu, R.-D., Anthony, L. and Wobbrock, J.O. (2012).
	 *	  Gestures as point clouds: A $P recognizer for user interface
	 *	  prototypes. Proceedings of the ACM Int'l Conference on
	 *	  Multimodal Interfaces (ICMI '12). Santa Monica, California
	 *	  (October 22-26, 2012). New York: ACM Press, pp. 273-280.
	 *
	 * This software is distributed under the "New BSD License" agreement:
	 *
	 * Copyright (c) 2012, Radu-Daniel Vatavu, Lisa Anthony, and
	 * Jacob O. Wobbrock. All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are met:
	 *    * Redistributions of source code must retain the above copyright
	 *      notice, this list of conditions and the following disclaimer.
	 *    * Redistributions in binary form must reproduce the above copyright
	 *      notice, this list of conditions and the following disclaimer in the
	 *      documentation and/or other materials provided with the distribution.
	 *    * Neither the names of the University Stefan cel Mare of Suceava,
	 *	University of Washington, nor UMBC, nor the names of its contributors
	 *	may be used to endorse or promote products derived from this software
	 *	without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
	 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
	 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
	 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Radu-Daniel Vatavu OR Lisa Anthony
	 * OR Jacob O. Wobbrock BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
	 * OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
	 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
	 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
	 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
	 * SUCH DAMAGE.
	**/
	//
	// Point class
	//

	function GreedyCloudMatch(points, P) {
		var e = 0.50;
		var step = Math.floor(Math.pow(points.length, 1 - e));
		var min = +Infinity;
		for (var i = 0; i < points.length; i += step) {
			var d1 = CloudDistance(points, P.Points, i);
			var d2 = CloudDistance(P.Points, points, i);
			min = Math.min(min, Math.min(d1, d2)); // min3
		}
		return min;
	}
	function CloudDistance(pts1, pts2, start) {
		var matched = new Array(pts1.length); // pts1.length == pts2.length
		for (var k = 0; k < pts1.length; k++) {
			matched[k] = false;
		}var sum = 0;
		var i = start;
		do {
			var index = -1;
			var min = +Infinity;
			for (var j = 0; j < matched.length; j++) {
				if (!matched[j]) {
					var d = Distance(pts1[i], pts2[j]);
					if (d < min) {
						min = d;
						index = j;
					}
				}
			}
			matched[index] = true;
			var weight = 1 - (i - start + pts1.length) % pts1.length / pts1.length;
			sum += weight * min;
			i = (i + 1) % pts1.length;
		} while (i != start);
		return sum;
	}
	function Resample(points, n) {
		var I = PathLength(points) / (n - 1); // interval length
		var D = 0.0;
		var newpoints = new Array(points[0]);
		for (var i = 1; i < points.length; i++) {
			if (points[i].ID == points[i - 1].ID) {
				var d = Distance(points[i - 1], points[i]);
				if (D + d >= I) {
					var qx = points[i - 1].X + (I - D) / d * (points[i].X - points[i - 1].X);
					var qy = points[i - 1].Y + (I - D) / d * (points[i].Y - points[i - 1].Y);
					var q = new _point2.default(qx, qy, points[i].ID);
					newpoints[newpoints.length] = q; // append new point 'q'
					points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
					D = 0.0;
				} else D += d;
			}
		}
		if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
			newpoints[newpoints.length] = new _point2.default(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
		return newpoints;
	}
	function Scale(points) {
		var minX = +Infinity,
		    maxX = -Infinity,
		    minY = +Infinity,
		    maxY = -Infinity;
		for (var i = 0; i < points.length; i++) {
			minX = Math.min(minX, points[i].X);
			minY = Math.min(minY, points[i].Y);
			maxX = Math.max(maxX, points[i].X);
			maxY = Math.max(maxY, points[i].Y);
		}
		var size = Math.max(maxX - minX, maxY - minY);
		var newpoints = new Array();
		for (var _i = 0; _i < points.length; _i++) {
			var qx = (points[_i].X - minX) / size;
			var qy = (points[_i].Y - minY) / size;
			newpoints[newpoints.length] = new _point2.default(qx, qy, points[_i].ID);
		}
		return newpoints;
	}
	function TranslateTo(points, pt) // translates points' centroid
	{
		var c = Centroid(points);
		var newpoints = new Array();
		for (var i = 0; i < points.length; i++) {
			var qx = points[i].X + pt.X - c.X;
			var qy = points[i].Y + pt.Y - c.Y;
			newpoints[newpoints.length] = new _point2.default(qx, qy, points[i].ID);
		}
		return newpoints;
	}
	function Centroid(points) {
		var x = 0.0,
		    y = 0.0;
		for (var i = 0; i < points.length; i++) {
			x += points[i].X;
			y += points[i].Y;
		}
		x /= points.length;
		y /= points.length;
		return new _point2.default(x, y, 0);
	}
	function PathDistance(pts1, pts2) // average distance between corresponding points in two paths
	{
		var d = 0.0;
		for (var i = 0; i < pts1.length; i++) {
			// assumes pts1.length == pts2.length
			d += Distance(pts1[i], pts2[i]);
		}return d / pts1.length;
	}
	function PathLength(points) // length traversed by a point path
	{
		var d = 0.0;
		for (var i = 1; i < points.length; i++) {
			if (points[i].ID == points[i - 1].ID) d += Distance(points[i - 1], points[i]);
		}
		return d;
	}
	function Distance(p1, p2) // Euclidean distance between two points
	{
		var dx = p2.X - p1.X;
		var dy = p2.Y - p1.Y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	exports.Distance = Distance;
	exports.PathLength = PathLength;
	exports.PathDistance = PathDistance;
	exports.Centroid = Centroid;
	exports.GreedyCloudMatch = GreedyCloudMatch;
	exports.TranslateTo = TranslateTo;
	exports.Scale = Scale;
	exports.Resample = Resample;
	exports.CloudDistance = CloudDistance;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Point = function Point(x, y, id) {
	  _classCallCheck(this, Point);

	  this.X = x;
	  this.Y = y;
	  this.ID = id; // stroke ID to which this point belongs (1,2,...)
	};

	exports.default = Point;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _coord = __webpack_require__(3);

	var coord = _interopRequireWildcard(_coord);

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var NumPoints = 32;

	var Origin = new _point2.default(0, 0, 0);

	var PointCloud = function PointCloud(name, points) {
		_classCallCheck(this, PointCloud);

		this.Name = name;
		this.Points = coord.Resample(points, NumPoints);
		this.Points = coord.Scale(this.Points);
		this.Points = coord.TranslateTo(this.Points, Origin);
	};

	exports.default = PointCloud;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.allRunes = undefined;
	exports.getUserRunes = getUserRunes;
	exports.getRunePoints = getRunePoints;

	var _recognizer = __webpack_require__(2);

	var _recognizer2 = _interopRequireDefault(_recognizer);

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	var _pointcloud = __webpack_require__(5);

	var _pointcloud2 = _interopRequireDefault(_pointcloud);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var allRunes = exports.allRunes = new Array(new _pointcloud2.default("attack", new Array(new _point2.default(0, 300, 1), new _point2.default(0, 0, 1), new _point2.default(100, 50, 1), new _point2.default(0, 100, 1), new _point2.default(100, 150, 1), new _point2.default(0, 200, 1), new _point2.default(100, 150, 2), new _point2.default(100, 50, 2))), new _pointcloud2.default("circle", new Array(
	///0.707 is 1+(1/sqrt2),
	//This isn't a circle, just a diagonal octagon.
	new _point2.default(100, 0, 1), new _point2.default(170, 39, 1), new _point2.default(200, 100, 1), new _point2.default(170, 170, 1), new _point2.default(100, 200, 1), new _point2.default(39, 170, 1), new _point2.default(0, 100, 1), new _point2.default(39, 39, 1), new _point2.default(100, 0, 1))), new _pointcloud2.default("amplify", new Array(new _point2.default(0, 100, 1), new _point2.default(200, 100, 1), new _point2.default(100, 0, 1), new _point2.default(100, 200, 1), new _point2.default(200, 200, 1), new _point2.default(50, 150, 2), new _point2.default(150, 50, 2))));
	//Private helper functions
	function getUserRunes(recognizer, runes) {
	  //Runes is array of the names of the runes that the user has.
	  allRunes.forEach(function (item, index) {
	    for (var i = 0; i < runes.length; i++) {
	      if (runes[i] == item.Name) {
	        recognizer.AddGesture(item.Name, item.Points);
	      }
	    }
	  });
	}
	function getRunePoints(gestureName, allRunes) {
	  for (var i = 0; i < allRunes.length; i++) {
	    if (gestureName == allRunes[i].Name) {
	      isARune = true;
	      return allRunes[i].Points;
	    }
	  }
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _coord = __webpack_require__(3);

	var coord = _interopRequireWildcard(_coord);

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	var _rune = __webpack_require__(8);

	var _rune2 = _interopRequireDefault(_rune);

	var _circle = __webpack_require__(9);

	var _circle2 = _interopRequireDefault(_circle);

	var _chalklings = __webpack_require__(10);

	var _chalklingCommand = __webpack_require__(12);

	var _chalklingCommand2 = _interopRequireDefault(_chalklingCommand);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Board = function () {
	  function Board(element) {
	    _classCallCheck(this, Board);

	    this.Element = element;
	    this.Contains = [_chalklings.Testling, _chalklings.EnemyTestling, new _circle2.default([new _point2.default(100, 0, 1), new _point2.default(170, 39, 1), new _point2.default(200, 100, 1), new _point2.default(170, 170, 1), new _point2.default(100, 200, 1), new _point2.default(39, 170, 1), new _point2.default(0, 100, 1), new _point2.default(39, 39, 1), new _point2.default(100, 0, 1)], 4)];
	    this.Contains[2].X = 400;
	    this.Contains[2].Y = 300;
	    this.Chalklings = this.getChalklings();
	    this.Contains[0].Position.X = 0;
	  }

	  _createClass(Board, [{
	    key: 'getId',
	    value: regeneratorRuntime.mark(function getId() {
	      var index;
	      return regeneratorRuntime.wrap(function getId$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              index = 3;
	              _context.next = 3;
	              return index++;

	            case 3:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, getId, this);
	    })
	  }, {
	    key: 'newCircle',
	    value: function newCircle(circle) {
	      var allCircles = [];
	      for (var i = 0; i < this.Contains.length; i++) {
	        if (this.Contains[i].constructor.name == "Circle") {
	          var tempCircles = this.getBinded(function () {}, this.Contains[i]);
	          allCircles = allCircles.concat(tempCircles, this.Contains[i]);
	        }
	      }
	      var mostLikelyCircle = void 0;
	      var mostLikelyCircleError = Infinity;
	      for (var _i = 0; _i < allCircles.length; _i++) {
	        var tempCircle = allCircles[_i];
	        var currentDistance = coord.Distance(tempCircle, new _point2.default(circle.X, circle.Y));
	        var tempCircleError = currentDistance - (circle.Radius + tempCircle.Radius); //Measures to see how close the new circle is to touching the outside of the current one.
	        if (tempCircleError < mostLikelyCircleError) {
	          //The ideal error is 0 (they are perfectly tangent circles)
	          mostLikelyCircleError = tempCircleError;
	          mostLikelyCircle = tempCircle;
	        }
	      }
	      if (mostLikelyCircleError > 200) {
	        //If the error is too high (>200 pixels);
	        //Don't bind it, just make it unbinded.
	        this.Contains.push(circle);
	      } else {
	        //It's probably binded to the mostLikelyCircle
	        mostLikelyCircle.bindRune(circle);
	      }
	    }
	  }, {
	    key: 'newRune',
	    value: function newRune(name, points) {
	      switch (name) {
	        case "circle":
	          var circle = new _circle2.default(points);
	          this.newCircle(circle);
	          break;
	        default:

	      }
	    }
	  }, {
	    key: 'getChalklings',
	    value: function getChalklings() {
	      var chalklings = [];
	      this.getBinded(function (rune) {
	        if (rune.constructor.name == "Chalkling") {
	          chalklings.push(rune);
	        }
	      });
	      return chalklings;
	    }
	  }, {
	    key: 'getBinded',
	    value: function getBinded() {
	      var callback = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];
	      //depth-first search
	      var binded = [];
	      for (var i = 0; i < this.Contains.length; i++) {
	        this.getBindedIncursion(this.Contains[i], binded, callback);
	      }
	      return binded;
	    }
	  }, {
	    key: 'getBindedIncursion',
	    value: function getBindedIncursion(rune, binded, callback) {
	      if (rune.HasBinded != null) {
	        //has binded stuff, find it recursively
	        for (var i = 0; i < rune.HasBinded.length; i++) {
	          this.getBindedIncursion(rune.HasBinded[i]);
	          binded.push(rune.HasBinded[i]);
	        }
	      }
	      binded.push(rune);
	      callback(rune);
	    }
	  }, {
	    key: 'removeDeadChalklings',
	    value: function removeDeadChalklings() {
	      var chalklings = this.Chalklings;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = chalklings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var chalkling = _step.value;

	          if (chalkling.CurrentAction == "DEATH") {
	            this.Contains.splice(this.Contains.indexOf(chalkling), 1); //If the chalkling is dead, removes is from board.
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'updateChalklingView',
	    value: function updateChalklingView() {
	      //Updates what each chalkling can see.
	      var chalklings = this.Chalklings;
	      for (var j = 0; j < chalklings.length; j++) {
	        for (var k = 0; k < chalklings.length; k++) {
	          var currentDistance = coord.Distance(chalklings[j].Position, chalklings[k].Position);
	          if (currentDistance < chalklings[j].Attributes.ViewRange) {
	            chalklings[j].Sees.push(chalklings[k]);
	          }
	        }
	      }
	    }
	  }, {
	    key: 'updateHitboxes',
	    value: function updateHitboxes() {
	      var _this = this;

	      var runes = this.getBinded();
	      var P = SAT.Polygon; //Shortening for easier typing
	      var C = SAT.Circle;
	      var V = SAT.Vector;
	      var B = SAT.Box;

	      var _loop = function _loop(i) {
	        var _loop2 = function _loop2(j) {
	          if (i == j) {
	            //Don't want to compare to outselves.
	            return 'continue';
	          }
	          var response = new SAT.Response();
	          var entity1 = runes[i];
	          var entity2 = runes[j];
	          if (entity1.constructor.name == "Circle" || entity2.constructor.name == "Circle") {
	            //One's a circle
	            if (entity1.constructor.name == "Circle" && entity2.constructor.name == "Circle") {
	              (function () {
	                //Both circles
	                var x1 = entity1.X;
	                var y1 = entity1.Y;
	                var x2 = entity2.X;
	                var y2 = entity2.Y;
	                SAT.testCircleCircle(new C(new V(x1, y1), entity1.Radius), new C(new V(x2, y2), entity2.Radius), response);
	                var smallerCircle = entity1.Radius >= entity2.Radius ? entity2 : entity1; //Determines smaller circle
	                _this.getBinded(function (rune) {
	                  //Finds the smaller circle, removes it.
	                  if (rune.HasBinded != null) {
	                    for (var k = 0; i < rune.HasBinded.length; k++) {
	                      if (rune.HasBinded[k].ID == smallerCircle.ID) {
	                        rune.HasBinded.splice(k, 1);
	                      }
	                    }
	                  }
	                });
	              })();
	            } else if (entity1.Name != null) {
	              //1 is chalkling, 2 is circle
	              var _x2 = entity1.Position.X;
	              var _y = entity1.Position.Y;
	              var _x3 = entity2.X;
	              var _y2 = entity2.Y;
	              if (SAT.testPolygonCircle(new B(new V(_x2, _y), 100, 100).toPolygon(), new C(new V(_x3, _y2), entity2.Radius, response))) {
	                console.log("collision!");
	                _this.getBinded(function (rune) {
	                  if (rune.ID == entity1.ID) {
	                    rune.Position.X -= response.overlapV.x;
	                    rune.Position.Y -= response.overlapV.y;
	                  }
	                });
	              }
	            } else if (entity2.Name != null) {
	              //2 is chalkling, 1 is circle
	              var _x4 = entity1.X;
	              var _y3 = entity1.Y;
	              var _x5 = entity2.Position.X;
	              var _y4 = entity2.Position.Y;
	              if (SAT.testPolygonCircle(new B(new V(_x5, _y4), 100, 100).toPolygon(), new C(new V(_x4, _y3), entity1.Radius), response)) {
	                ;
	                _this.getBinded(function (rune) {
	                  if (rune.ID == entity2.ID) {
	                    rune.Position.X -= response.overlapV.x;
	                    rune.Position.Y -= response.overlapV.y;
	                  }
	                });
	              }
	            } else {//It's a circle and something else, do nothing

	            }
	          } else if (entity1.Name != null && entity2.Name != null) {
	            //Both are chalklings
	            var _x6 = entity1.Position.X;
	            var _y5 = entity1.Position.Y;
	            var _x7 = entity2.Position.X;
	            var _y6 = entity2.Position.Y;
	            //Create a bounding box around chalkling
	            var firstChalklingBox = new B(new V(_x6, _y5), 100, 100).toPolygon();
	            var secondChalklingBox = new B(new V(_x7, _y6), 100, 100).toPolygon();
	            var collided = SAT.testPolygonPolygon(firstChalklingBox, secondChalklingBox, response);
	            if (collided) {
	              (function () {
	                var collidedVector = response.overlapV.scale(0.5); //How much they overlap
	                _this.getBinded(function (rune) {
	                  if (entity1.ID == rune.ID) {
	                    rune.Position.X -= collidedVector.x;
	                    rune.Position.Y -= collidedVector.y;
	                  }
	                });
	                _this.getBinded(function (rune) {
	                  if (entity2.ID == rune.ID) {
	                    rune.Position.X += collidedVector.x;
	                    rune.Position.Y += collidedVector.y;
	                  }
	                });
	              })();
	            }
	          }
	        };

	        for (var j = 0; j < runes.length; j++) {
	          var _ret2 = _loop2(j);

	          if (_ret2 === 'continue') continue;
	        }
	      };

	      for (var i = 0; i < runes.length; i++) {
	        _loop(i);
	      }
	    }
	  }, {
	    key: 'updateChalklingTargetPositions',
	    value: function updateChalklingTargetPositions() {
	      var chalklings = this.Chalklings;
	      for (var i = 0; i < chalklings.length; i++) {
	        for (var j = 0; j < chalklings.length; j++) {
	          if (chalklings[i].Target.ID == chalklings[j].ID) {
	            chalklings[i].Target.Position = chalklings[j].Position;
	          } else if (chalklings[j].Target.ID == chalklings[i].ID) {
	            chalklings[j].Target.Position = chalklings[i].Position;
	          }
	        }
	      }
	      this.Chalklings = chalklings;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.Chalklings = this.getChalklings();
	      this.removeDeadChalklings();
	      this.updateHitboxes();
	      this.updateChalklingView();
	      var renderString = '';
	      for (var i = 0; i < this.Contains.length; i++) {
	        if (this.Contains[i].constructor.name == "Circle") {
	          var binded = this.getBinded(function () {}, this.Contains[i]);
	          for (var j = 0; j < binded.length; j++) {
	            renderString += binded[j].render();
	          }
	        }
	        renderString += this.Contains[i].render();
	      }
	      return renderString;
	    }
	  }]);

	  return Board;
	}();

	exports.default = Board;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _runeData = __webpack_require__(6);

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	var _coord = __webpack_require__(3);

	var coord = _interopRequireWildcard(_coord);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Rune = function () {
	  //A Rune is a non-animated (static) set of points
	  function Rune(points, id) {
	    _classCallCheck(this, Rune);

	    this.Points = points;
	    this.ID = id;
	  }

	  _createClass(Rune, [{
	    key: 'resize',
	    value: function resize(scale) {
	      var resizedPoints = [];
	      for (var i = 0; i < this.Points.length; i++) {
	        var newX = scale * (this.Points[i].X - this.X) + this.X;
	        var newY = scale * (this.Points[i].Y - this.Y) + this.Y;
	        resizedPoints.push(new _point2.default(newX, newY, this.Points[i].ID));
	      }
	      this.Points = coord.TranslateTo(resizedPoints, coord.Centroid(this.Points));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var currentStroke = -1;
	      var svgPathString = '';
	      for (var i = 0; i < this.Points.length; i++) {
	        if (this.Points[i].ID != currentStroke) {
	          //If there is a new stroke
	          currentStroke = this.Points[i].ID;
	          svgPathString += "M" + this.Points[i].X + " " + this.Points[i].Y;
	        } else {
	          svgPathString += "L" + this.Points[i].X + " " + this.Points[i].Y;
	        }
	      }
	      return '<path stroke="black" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>';
	    }
	  }]);

	  return Rune;
	}();

	exports.default = Rune;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _recognizer = __webpack_require__(2);

	var _recognizer2 = _interopRequireDefault(_recognizer);

	var _rune = __webpack_require__(8);

	var _rune2 = _interopRequireDefault(_rune);

	var _coord = __webpack_require__(3);

	var coord = _interopRequireWildcard(_coord);

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Circle = function (_Rune) {
	  _inherits(Circle, _Rune);

	  function Circle(Points, ID) {
	    _classCallCheck(this, Circle);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).call(this, Points, ID));

	    _this.X = coord.Centroid(_this.Points).X;
	    _this.Y = coord.Centroid(_this.Points).Y;
	    _this.Radius = _this.averageDistanceFromCenter();
	    _this.HasBinded = [];
	    return _this;
	  }

	  _createClass(Circle, [{
	    key: 'averageDistanceFromCenter',
	    value: function averageDistanceFromCenter() {
	      var distances = 0;
	      for (var i = 0; i < this.Points.length; i++) {
	        distances += coord.Distance(new _point2.default(this.X, this.Y), this.Points[i]);
	      }
	      var avgDistance = distances / this.Points.length;
	      return avgDistance;
	    }
	  }, {
	    key: 'getBinded',
	    value: function getBinded(object) {
	      //depth-first search to find all objects of type object
	      var binded = [];
	      this.getBindedIncursion(this, object, binded);
	      return binded;
	    }
	  }, {
	    key: 'getBindedIncursion',
	    value: function getBindedIncursion(circle, object, binded) {
	      if (circle.HasBinded.length != 0) {
	        for (var i = 0; i < circle.HasBinded.length; i++) {
	          if (typeof object == "undefined" || circle.HasBinded[i].constructor.name == object || circle.HasBinded[i].constructor.name == "Circle") {
	            binded.push(circle.HasBinded[i]);
	            this.getBindedIncursion(circle.HasBinded[i]);
	          } else {}
	        }
	      }
	    }
	  }, {
	    key: 'bindRune',
	    value: function bindRune(rune) {
	      this.HasBinded.push(rune);
	    }
	  }, {
	    key: 'renderBinded',
	    value: function renderBinded() {
	      var renderString = '';
	      var binded = getBinded(this);
	      for (var i = 0; i < binded; i++) {
	        renderString = +binded[i].render();
	      }
	      return renderString;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      //Render functions return svg path strings
	      var radius = this.Radius;
	      var r = radius.toString();
	      return "<path fill='none' stroke='black' strokewidth=3 d='M" + this.X + " " + this.Y + "m" + (-1 * radius).toString() + " 0a" + r + "," + r + " 0 1,0 " + (radius * 2).toString() + ",0" + "a " + r + "," + r + " 0 1,0 " + (radius * -2).toString() + ",0" + "'></path>";
	      //Circle formula for paths found here: http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334
	    }
	  }]);

	  return Circle;
	}(_rune2.default);

	exports.default = Circle;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EnemyTestling = exports.Testling = undefined;

	var _chalkling = __webpack_require__(11);

	var _chalkling2 = _interopRequireDefault(_chalkling);

	var _attributeSet = __webpack_require__(13);

	var _attributeSet2 = _interopRequireDefault(_attributeSet);

	var _chalklingCommand = __webpack_require__(12);

	var _chalklingCommand2 = _interopRequireDefault(_chalklingCommand);

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Testling = exports.Testling = new _chalkling2.default("Testling", 1, "blue", new _point2.default(300, 300), new _attributeSet2.default(100, 1, 1000, 600, 300, 50));
	var EnemyTestling = exports.EnemyTestling = new _chalkling2.default("Enemy Testling", 2, "red", new _point2.default(500, 300), new _attributeSet2.default(100, 1, 1000, 600, 300, 200));

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _coord = __webpack_require__(3);

	var coord = _interopRequireWildcard(_coord);

	var _chalklingCommand = __webpack_require__(12);

	var _chalklingCommand2 = _interopRequireDefault(_chalklingCommand);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Chalkling = function () {
	  function Chalkling(name, id, player, position, attributeSet, animationData) {
	    _classCallCheck(this, Chalkling);

	    this.Name = name;
	    this.Player = player;
	    this.ID = id;
	    this.Position = position;
	    this.Attributes = attributeSet;
	    this.Animations = animationData;
	    this.CurrentAction = "IDLE";
	    this.Frame = 0;
	    this.Sees = [];
	    this.AnimationEnd = -1;
	    this.Queue = [];
	    this.Target = null;
	  }

	  _createClass(Chalkling, [{
	    key: 'getAnimation',
	    value: function getAnimation() {
	      //Example path: ./chalklings/Testling/Animations/Idle/X
	      var pathToAnimation = '';
	      switch (this.CurrentAction) {
	        case "IDLE":
	          pathToAnimation = './chalklings/' + this.Name + '/Animations/Idle/' + this.Frame + ".png";
	          break;
	        case "WALK":
	          pathToAnimation = './chalklings/' + this.Name + '/Animations/Walk/' + this.Frame + ".png";
	          break;
	        case "ATTACK":
	          pathToAnimation = './chalklings/' + this.Name + '/Animations/Attack/' + this.Frame + ".png";
	          break;
	        case "DEATH":
	          pathToAnimation = './chalklings/' + this.Name + '/Animations/Death/' + this.Frame + ".png";
	          break;
	        case "FINISHER":
	          pathToAnimation = './chalklings/' + this.Name + '/Animations/Finishers/' + this.Target.Name + '/' + this.Frame + ".png";
	          break;
	        case "CRITICAL":
	          pathToAnimation = './chalklings/' + this.Name + '/Animations/Critical/' + this.Frame + ".png";
	          break;
	        default:
	          pathToAnimation = './chalklings/' + this.Name + '/Animations/Idle/' + this.Frame + ".png";
	      }
	      return pathToAnimation;
	    }
	  }, {
	    key: 'makeInterval',
	    value: function makeInterval(time) {
	      return new Promise(function (resolve, reject) {
	        setTimeout(resolve, time);
	      });
	    }
	  }, {
	    key: 'doCommand',
	    value: function doCommand(command) {
	      var self = this;
	      this.makeInterval(command.Time).then(function () {
	        command.Action(self);
	        if (!command.EndCondition(self)) {
	          self.doCommand(command);
	        } else {}
	      });
	    }
	  }, {
	    key: 'moveTo',
	    value: function moveTo(position) {
	      this.CurrentAction = "WALK";
	      this.doCommand(new _chalklingCommand2.default(function (chalkling) {
	        //yay, geometry! Here we go again....
	        var me = chalkling.Position;
	        var moveDistance = chalkling.Attributes.MovementSpeed / 30;
	        var dx = position.X - me.X;
	        var dy = position.Y - me.Y;
	        var distance = coord.Distance(me, position);
	        var unitX = dx / distance;
	        var unitY = dy / distance;
	        var newX = unitX * moveDistance;
	        var newY = unitY * moveDistance;
	        me.Y += newY;
	        me.X += newX;
	        //I know thats a lot of unneccesary variables but showing it all makes it more understandable.
	        //http://stackoverflow.com/questions/12550365/calculate-a-point-along-the-line-a-b-at-a-given-distance-from-a
	      }, 33, function (chalkling) {
	        if (coord.Distance(chalkling.Position, position) < 100 || chalkling.CurrentAction != "WALK") {
	          return true;
	        } else {
	          return false;
	        }
	      }));
	    }
	  }, {
	    key: 'die',
	    value: function die() {
	      this.CurrentAction = "DEATH";
	      console.log("A " + this.Player + " " + this.Name + " has died!");
	    }
	  }, {
	    key: 'getNearbyEnemies',
	    value: function getNearbyEnemies() {
	      var enemies = [];
	      for (var i = 0; i < this.Sees.length; i++) {
	        if (this.Sees[i].Player != this.Player) {
	          enemies.push(this.Sees[i]);
	        }
	      }
	      return enemies;
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      if (this.Attributes.Health == 0) {
	        //1. Is it dead?
	        this.die();
	        return;
	      }
	      if (this.Frame == this.AnimationEnd) {
	        //2. Is it's action done?
	        if (this.Queue.length != 0) {
	          this.nextCommand();
	        } else {
	          this.CurrentAction = "IDLE";
	        }
	        this.Frame = 0;
	      }
	      for (var i = 0; i < this.Attributes.Modifiers; i++) {
	        //3. Can any of it's modifiers be applied?
	        var currentModifier = this.Attributes.Modifiers[i];
	        if (currentModifier.Condition(this) == true) {
	          currentModifier.AttributeChange(this);
	        }
	      }
	      if (this.CurrentAction == "IDLE" && this.getNearbyEnemies().length != 0) {
	        //4. Is there a nearby enemy I can attack?
	        this.Target = this.getNearbyEnemies()[0];
	      }
	      if (this.Target != null) {
	        //If there's a target:
	        if (coord.Distance(this.Target.Position, this.Position) >= this.Attributes.ViewRange) {
	          //5. Can i still see the target?
	          this.CurrentAction = "IDLE";
	        }
	        if (coord.Distance(this.Target.Position, this.Position) <= this.Attributes.AttackRange) {
	          //6. Should I move to follow my target?
	          this.CurrentAction = "ATTACK";
	        } else {
	          this.CurrentAction = "WALK";
	          this.moveTo(this.Target.Position);
	        }
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.update();
	      return "<image xlink:href=\"" + this.getAnimation() + "\" x=\"" + this.Position.X + "\" y=\"" + this.Position.Y + "\" height=\"100\" width=\"100\" />";
	    }
	  }]);

	  return Chalkling;
	}();

	exports.default = Chalkling;

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ChalklingCommand = function ChalklingCommand(callback, time) {
	  var endCondition = arguments.length <= 2 || arguments[2] === undefined ? function () {
	    return true;
	  } : arguments[2];

	  _classCallCheck(this, ChalklingCommand);

	  //callback's first parameter is references as the chalkling the command is given to, time is how long the callback takes,
	  //if endCondition is met the action ends.
	  this.Action = callback;
	  this.Time = time;
	  this.EndCondition = endCondition;
	};

	exports.default = ChalklingCommand;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AttributeSet = function AttributeSet(health, attack, attackRate, viewRange, attackRange, speed, modifiers) {
	  _classCallCheck(this, AttributeSet);

	  this.MaxHealth = health;
	  this.Health = health;
	  this.Attack = attack;
	  this.AttackRate = attackRate;
	  this.ViewRange = viewRange;
	  this.AttackRange = attackRange;
	  this.MovementSpeed = speed;
	  this.Modifiers = modifiers;
	};

	exports.default = AttributeSet;

/***/ }
/******/ ]);