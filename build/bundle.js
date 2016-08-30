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

	var _gameState = __webpack_require__(7);

	var _gameState2 = _interopRequireDefault(_gameState);

	var _circle = __webpack_require__(10);

	var _circle2 = _interopRequireDefault(_circle);

	var _runeData = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	console.log('hello world from ' + __dirname);

	var b = void 0,
	    c = void 0;
	var lastFrameTime = 0;

	window.onload = function () {
	    b = new _gameState2.default('content');
	    c = new _canvas2.default(b, ["circle", "attack"]);
	    requestAnimationFrame(gameLoop);
	};
	function gameLoop(timeStamp) {
	    var changeInTime = timeStamp - lastFrameTime;
	    lastFrameTime = timeStamp;
	    update(changeInTime);
	    render();
	    requestAnimationFrame(gameLoop);
	}

	function update(time) {
	    b.update(time);
	}
	function render() {
	    var svgElements = "<svg width='100%' height='100%'>" + b.render() + c.render() + "</svg>";
	    document.getElementById(b.Element).innerHTML = svgElements;
	}

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

	// MIT license

	(function () {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	    }

	    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
	        var currTime = new Date().getTime();
	        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	        var id = window.setTimeout(function () {
	            callback(currTime + timeToCall);
	        }, timeToCall);
	        lastTime = currTime + timeToCall;
	        return id;
	    };

	    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
	        clearTimeout(id);
	    };
	})();
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

	var _gameState = __webpack_require__(7);

	var _gameState2 = _interopRequireDefault(_gameState);

	var _rune = __webpack_require__(8);

	var _rune2 = _interopRequireDefault(_rune);

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	var _coord = __webpack_require__(3);

	var coord = _interopRequireWildcard(_coord);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Canvas = function () {
	  function Canvas(board, runes) {
	    _classCallCheck(this, Canvas);

	    this.GameState = board;
	    this.Runes = runes;
	    this.Mode = "COMMAND";
	    this.CurrentRune = new _rune2.default([]);
	    this.StrokeId = 0;
	    this.Recognizer = new _recognizer2.default();
	    this.enable();
	  }

	  _createClass(Canvas, [{
	    key: 'changeMode',
	    value: function changeMode(mode) {
	      this.CurrentRune = new _rune2.default([]);
	      this.Mode = mode;
	    }
	  }, {
	    key: 'enable',
	    value: function enable() {
	      var _this = this;

	      (0, _runeData.getUserRunes)(this.Recognizer, this.Runes);
	      var DOM = '#' + this.GameState.Element;
	      $(document).on("keydown", function (key) {
	        if (key.which == 90) {
	          //If "z" key held down
	          //Clear Points
	          _this.CurrentRune.Points = [];
	        } else if (key.which == 49) {
	          //"1" key
	          //Set to draw mode
	          _this.changeMode("DRAW");
	        } else if (key.which == 50) {
	          //"2" key
	          _this.changeMode("COMMAND");
	        } else if (key.which == 16 && _this.Mode == "DRAW") {
	          _this.changeMode("STRAIGHTLINE");
	        }
	      });
	      $(document).on("keyup", function (key) {
	        if (key.which == 16 && _this.Mode == "STRAIGHTLINE") {
	          //Shift
	          _this.changeMode("DRAW");
	        }
	      });
	      $(DOM).on("mousedown", function (mouseDownEvent) {
	        if (mouseDownEvent.button == 2 && _this.Mode != "SELECTION") {
	          //Right click
	          _this.changeMode("SELECTION");
	        } else if (mouseDownEvent.button == 0 && _this.Mode == "SELECTION") {
	          //Left click
	          _this.changeMode("COMMAND");
	        }
	        _this.doAction(mouseDownEvent, "mousedown");
	        $(DOM).on("mousemove", function (mouseMoveEvent) {
	          _this.doAction(mouseMoveEvent, "mousemove");
	        });
	      });
	      $(DOM).on("mouseup", function () {
	        $(DOM).off("mousemove");
	        _this.doAction(null, "mouseup");
	      });
	    }
	  }, {
	    key: 'doAction',
	    value: function doAction(passedEvent, type) {
	      if (this.Mode == "DRAW") {
	        if (type == "mousemove") {
	          var mousePosition = this.getMousePosition(passedEvent);
	          //Add the new point data
	          this.CurrentRune.Points.push(new _point2.default(mousePosition.X, mousePosition.Y, this.StrokeId));
	        } else if (type == "mouseup") {
	          var recognizedResult = this.Recognizer.Recognize(this.CurrentRune.Points);
	          //WARNING Recognize adds 99-98 more randon points to a point array, which is why I made a clone of of the points and then recognized the clone.
	          if (recognizedResult.Score > 0.1) {
	            //If they just drew something
	            this.GameState.newRune(recognizedResult.Name, this.CurrentRune.Points, "blue");
	            this.CurrentRune = new _rune2.default([]);
	          }
	          this.StrokeId++;
	        }
	      } else if (this.Mode == "SELECTION") {
	        if (type == "mousedown") {
	          this.CurrentRune = new _rune2.default([this.getMousePosition(passedEvent)]);
	        } else if (type == "mousemove") {
	          var startPos = this.CurrentRune.Points[0];
	          var currentPos = this.getMousePosition(passedEvent);
	          this.CurrentRune.Points = [startPos, new _point2.default(startPos.X, currentPos.Y), currentPos, new _point2.default(currentPos.X, startPos.Y), startPos];
	        } else if (type == "mouseup") {
	          this.GameState.selectChalklingsInRect(this.CurrentRune.Points[0], this.CurrentRune.Points[2]);
	          this.CurrentRune = new _rune2.default([]);
	        }
	      } else if (this.Mode == "COMMAND") {
	        if (type == "mousedown") {} else if (type == "mousemove") {
	          var _mousePosition = this.getMousePosition(passedEvent);
	          //Add the new point data
	          this.CurrentRune.Points.push(new _point2.default(_mousePosition.X, _mousePosition.Y, this.StrokeId));
	        } else if (type == "mouseup") {
	          this.GameState.moveSelectedAlongPath(this.CurrentRune.Points);
	          this.CurrentRune = new _rune2.default([]);
	        }
	      } else if (this.Mode == "STRAIGHTLINE") {
	        if (type == "mousedown") {
	          this.CurrentRune = new _rune2.default([this.getMousePosition(passedEvent)]);
	        } else if (type == "mousemove") {
	          this.CurrentRune.Points[1] = this.getMousePosition(passedEvent);
	        } else if (type == "mouseup") {
	          this.GameState.newRune("line", this.CurrentRune.Points, "ALKJADLSK");
	        }
	      }
	    }
	  }, {
	    key: 'getMousePosition',
	    value: function getMousePosition(passedEvent) {

	      var parentOffset = $("#" + this.GameState.Element).offset();
	      //Offset allows for containers that don't fit thte entire page and work inside the surface.
	      var relX = passedEvent.pageX - parentOffset.left;
	      var relY = passedEvent.pageY - parentOffset.top;
	      return new _point2.default(relX, relY);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var path = void 0;
	      switch (this.Mode) {
	        case "DRAW":
	          path = this.CurrentRune.render("FILL");
	          break;
	        case "COMMAND":
	          path = this.CurrentRune.render("DASH");
	          break;
	        case "SELECTION":
	          path = this.CurrentRune.render("FADE");
	          break;
	        default:
	          path = this.CurrentRune.render();
	      }
	      return path.RenderString;
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
	exports.movePointAlongLine = exports.CloudDistance = exports.Resample = exports.Scale = exports.TranslateTo = exports.GreedyCloudMatch = exports.Centroid = exports.PathDistance = exports.PathLength = exports.Distance = undefined;

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
	function movePointAlongLine(pt1, pt2, distanceToMove) {
		var dx = pt2.X - pt1.X;
		var dy = pt2.Y - pt1.Y;
		var distance = Distance(pt1, pt2);
		var unitX = dx / distance;
		var unitY = dy / distance;
		var newX = unitX * distanceToMove + pt1.X;
		var newY = unitY * distanceToMove + pt1.Y;
		return new _point2.default(newX, newY);
	}
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
	exports.movePointAlongLine = movePointAlongLine;

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
	//Helper functions
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

	var _circle = __webpack_require__(10);

	var _circle2 = _interopRequireDefault(_circle);

	var _chalklings = __webpack_require__(13);

	var _sat = __webpack_require__(12);

	var SAT = _interopRequireWildcard(_sat);

	var _chalkling = __webpack_require__(14);

	var _chalkling2 = _interopRequireDefault(_chalkling);

	var _line = __webpack_require__(15);

	var _line2 = _interopRequireDefault(_line);

	var _renderedElement = __webpack_require__(9);

	var _renderedElement2 = _interopRequireDefault(_renderedElement);

	var _selectedOverlay = __webpack_require__(16);

	var _selectedOverlay2 = _interopRequireDefault(_selectedOverlay);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GameState = function () {
	  function GameState(element) {
	    _classCallCheck(this, GameState);

	    this.Element = element;
	    this.Contains = [new _chalklings.Testling(1, "red", new _point2.default(300, 0)), new _circle2.default([new _point2.default(100, 0, 1), new _point2.default(170, 39, 1), new _point2.default(200, 100, 1), new _point2.default(170, 170, 1), new _point2.default(100, 200, 1), new _point2.default(39, 170, 1), new _point2.default(0, 100, 1), new _point2.default(39, 39, 1), new _point2.default(100, 0, 1)], 2, "red")];
	    this.Selected = [];
	    this.Contains[0].moveTo(new _point2.default(300, 300));
	    this.Contains[1].moveTo(new _point2.default(300, 600));
	    this.IDGenerator = this.getId();
	  }

	  _createClass(GameState, [{
	    key: 'getId',
	    value: regeneratorRuntime.mark(function getId() {
	      var index;
	      return regeneratorRuntime.wrap(function getId$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              index = 3;

	            case 1:
	              if (false) {
	                _context.next = 6;
	                break;
	              }

	              _context.next = 4;
	              return index++;

	            case 4:
	              _context.next = 1;
	              break;

	            case 6:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, getId, this);
	    })
	  }, {
	    key: 'getCircles',
	    value: function getCircles() {
	      var circles = [];
	      this.getBinded(function (rune) {
	        if (rune.constructor.name == "Circle") {
	          circles.push(rune);
	        }
	      });
	      return circles;
	    }
	  }, {
	    key: 'newCircle',
	    value: function newCircle(circle) {
	      var allCircles = this.getCircles();
	      var mostLikelyCircle = void 0;
	      var mostLikelyCircleError = Infinity;
	      for (var i = 0; i < allCircles.length; i++) {
	        var tempCircle = allCircles[i];
	        var currentDistance = coord.Distance(tempCircle.Position, circle.Position);
	        var tempCircleError = currentDistance - (circle.Radius + tempCircle.Radius); //Measures to see how close the new circle is to touching the outside of the current one.
	        if (tempCircleError < mostLikelyCircleError) {
	          //The ideal error is 0 (they are perfectly tangent circles)
	          mostLikelyCircleError = tempCircleError;
	          mostLikelyCircle = tempCircle;
	        }
	      }
	      if (mostLikelyCircleError > 50) {
	        //If the error is too high (>50 pixels);
	        //Don't bind it, just make it unbinded.
	        this.Contains.push(circle);
	      } else {
	        //It's probably binded to the mostLikelyCircle
	        var currentToBinded = coord.Distance(circle.Position, mostLikelyCircle.Position);
	        var error = currentToBinded - circle.Radius - mostLikelyCircle.Radius;
	        circle.moveTo(coord.movePointAlongLine(circle.Position, mostLikelyCircle.Position, error));
	        mostLikelyCircle.bindRune(circle);
	      }
	    }
	  }, {
	    key: 'newRune',
	    value: function newRune(name, points, team) {
	      switch (name) {
	        case "circle":
	          var circle = new _circle2.default(points, this.IDGenerator.next(), "blue");
	          this.newCircle(circle);
	          break;
	        case "attack":
	          this.Contains.push(new _chalklings.Testling(this.IDGenerator.next(), team, new _point2.default(coord.Centroid(points).X, coord.Centroid(points).Y)));
	          break;
	        case "line":
	          var distance = coord.Distance(points[0], points[1]);
	          var lines = [];
	          for (var i = 0; i < distance / 10; i++) {
	            var point1 = coord.movePointAlongLine(points[0], points[1], i * 10);
	            var point2 = coord.movePointAlongLine(points[0], points[1], (i + 1) * 10);
	            var line = new _line2.default(point1, point2, this.IDGenerator.next(), team);
	            lines.push(line);
	            //TODO: Don't just push it randomly
	            this.Contains.push(line);
	          }
	          //TODO: Check the first, last, and middle lines to circle bind points and then bind them.
	          break;
	        default:

	      }
	    }
	  }, {
	    key: 'moveSelectedAlongPath',
	    value: function moveSelectedAlongPath(path) {
	      if (this.Selected[0] != null) {
	        for (var i = 0; i < this.Selected.length; i++) {
	          var currentSelected = this.Selected[i];
	          currentSelected.moveAlongPath(path);
	        }
	      }
	    }
	  }, {
	    key: 'getBinded',
	    value: function getBinded() {
	      var callback = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];
	      var parent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	      //depth-first search.
	      //If parent is true, the callback will be function(parent, child)
	      var binded = [];
	      for (var i = 0; i < this.Contains.length; i++) {
	        this.getBindedIncursion(this.Contains[i], binded, callback, parent);
	      }
	      return binded;
	    }
	  }, {
	    key: 'getBindedIncursion',
	    value: function getBindedIncursion(rune, binded, callback, parent) {
	      if (typeof rune.HasBinded != "undefined") {
	        //has binded stuff, find it recursively
	        if (parent) {
	          callback(rune);
	        }
	        for (var i = 0; i < rune.HasBinded.length; i++) {
	          this.getBindedIncursion(rune.HasBinded[i], binded, callback, parent);
	        }
	        binded.push(rune);
	      } else {
	        binded.push(rune);
	      }
	      if (!parent) {
	        callback(rune);
	      }
	    }
	  }, {
	    key: 'removeDeadChalklings',
	    value: function removeDeadChalklings() {
	      var _this = this;

	      this.getBinded(function (rune) {
	        if (_this.isChalkling(rune)) {
	          if (rune.CurrentAction == "DEATH") {
	            _this.Contains.splice(_this.Contains.indexOf(rune), 1); //If the chalkling is dead, removes is from board.
	            _this.Selected.splice(_this.Contains.indexOf(rune), 1); //Also, make sure you unselect it.
	          }
	        }
	      });
	    }
	  }, {
	    key: 'updateChalklingView',
	    value: function updateChalklingView() {
	      //Updates what each chalkling can see.
	      var runes = this.getBinded();
	      for (var j = 0; j < runes.length; j++) {
	        var newSees = [];
	        for (var k = 0; k < runes.length; k++) {
	          if (j == k) {
	            //Don't add ourselves to what we see.
	            continue;
	          }
	          if (this.isChalkling(runes[j])) {
	            var currentDistance = coord.Distance(runes[j].Position, runes[k].Position);
	            if (currentDistance < runes[j].Attributes.ViewRange) {
	              newSees.push(runes[k]);
	            }
	          }
	        }
	        runes[j].Sees = newSees;
	      }
	    }
	  }, {
	    key: 'updateHitboxes',
	    value: function updateHitboxes() {
	      var runes = this.getBinded();
	      var P = SAT.Polygon; //Shortening for easier typing
	      var C = SAT.Circle;
	      var V = SAT.Vector;
	      var B = SAT.Box;
	      for (var i = 0; i < runes.length; i++) {
	        for (var j = 0; j < runes.length; j++) {
	          if (i == j) {
	            //Don't want to compare to ourselves.
	            continue;
	          }
	          var response = new SAT.Response();
	          var entity1 = runes[i];
	          var entity2 = runes[j];
	          var BOUNCE = 1.1;
	          if (entity1.constructor.name == "Circle" || entity2.constructor.name == "Circle") {
	            //One's a circle
	            if (entity1.constructor.name == "Circle" && entity2.constructor.name == "Circle") {//Both circles

	            } else if (this.isChalkling(entity1)) {
	              //1 is chalkling, 2 is circle
	              if (SAT.testPolygonPolygon(new B(new V(entity1.TopLeft.X, entity1.TopLeft.Y), 100, 100).toPolygon(), entity2.toSATPolygon(), response)) {
	                entity1.Position.X -= response.overlapV.x + 1 * BOUNCE;
	                entity1.Position.Y -= response.overlapV.y + 1 * BOUNCE;
	                //Stop the chalkling from walking, so it doesn't get stuck there.
	                entity1.override();
	              }
	            } else if (this.isChalkling(entity2)) {
	              //2 is chalkling, 1 is circle
	              if (SAT.testPolygonPolygon(new B(new V(entity2.TopLeft.X, entity2.TopLeft.Y), 100, 100).toPolygon(), entity1.toSATPolygon(), response)) {
	                entity2.Position.Y -= response.overlapV.y + 1 * BOUNCE;
	                entity2.override();
	              }
	            } else {//It's a circle and something else, do nothing

	            }
	          } else if (this.isChalkling(entity1) && this.isChalkling(entity2)) {//Both are chalklings

	            //For now, it's ok for them to overlap. Uncomment if you want them not to.
	            /*
	            //Create a bounding box around chalkling
	            let firstChalklingBox = new B(new V(entity1.TopLeft.X, entity1.TopLeft.Y), 100, 100).toPolygon();
	            let secondChalklingBox = new B(new V(entity2.TopLeft.X, entity2.TopLeft.Y), 100, 100).toPolygon();
	            let collided = SAT.testPolygonPolygon(firstChalklingBox, secondChalklingBox, response);
	            if(collided){
	              let collidedVector = response.overlapV.scale(0.5); //How much they overlap
	              entity1.Position.X -=collidedVector.x;
	              entity1.Position.Y -=collidedVector.y;
	              entity2.Position.X +=collidedVector.x;
	              entity2.Position.Y +=collidedVector.y;
	            }
	            */
	          }
	        }
	      }
	    }
	  }, {
	    key: 'removeDeadBindedRunes',
	    value: function removeDeadBindedRunes(runeType) {
	      for (var j = 0; j < this.Contains.length; j++) {
	        if (this.Contains[j].constructor.name == runeType) {
	          if (this.Contains[j].Attributes.Health <= 0) {
	            this.Contains.splice(j, 1);
	          }
	        }
	      }
	      this.getBinded(function (parent) {
	        //This will remove circles that are binded. We also need to check the top-level circles as well (done above).
	        for (var i = 0; i < parent.HasBinded.length; i++) {
	          if (parent.HasBinded[i].Attributes.Health <= 0) {
	            parent.HasBinded.splice(i, 1);
	          }
	        }
	      }, true);
	    }
	  }, {
	    key: 'selectChalklingAtPoint',
	    value: function selectChalklingAtPoint(point) {
	      var _this2 = this;

	      var V = SAT.Vector;
	      var B = SAT.Box;
	      var vecPoint = new V(point.X, point.Y);
	      var chalkling = null;
	      this.getBinded(function (rune) {
	        if (_this2.isChalkling(rune)) {
	          if (SAT.pointInPolygon(vecPoint, new B(new V(rune.TopLeft.X, rune.TopLeft.Y), 100, 100).toPolygon())) {
	            chalkling = rune;
	          }
	        }
	      });
	      this.Selected = [chalkling];
	    }
	  }, {
	    key: 'selectChalklingsInRect',
	    value: function selectChalklingsInRect(point1, point2) {
	      var _this3 = this;

	      var V = SAT.Vector;
	      var B = SAT.Box;
	      var lesserX = point1.X > point2.X ? point2.X : point1.X;
	      var lesserY = point1.Y > point2.Y ? point2.Y : point1.Y;
	      var greaterX = point1.X < point2.X ? point2.X : point1.X;
	      var greaterY = point1.Y < point2.Y ? point2.Y : point1.Y;
	      var selected = [];
	      this.getBinded(function (rune) {
	        if (_this3.isChalkling(rune)) {
	          var vecPoint = new V(rune.Position.X, rune.Position.Y);
	          if (SAT.pointInPolygon(vecPoint, new B(new V(lesserX, lesserY), greaterX - lesserX, greaterY - lesserY).toPolygon())) {
	            selected.push(rune);
	          }
	        }
	      });
	      this.Selected = selected;
	    }
	  }, {
	    key: 'isChalkling',
	    value: function isChalkling(rune) {
	      if (rune.__proto__ instanceof _chalkling2.default) {
	        return true;
	      } else {
	        return false;
	      }
	    }
	  }, {
	    key: 'renderSelected',
	    value: function renderSelected() {
	      var selectedArray = [];
	      for (var i = 0; i < this.Selected.length; i++) {
	        var currentRunePosition = this.Selected[i].TopLeft;
	        selectedArray.push(new _selectedOverlay2.default(currentRunePosition));
	      }
	      return selectedArray;
	    }
	  }, {
	    key: 'update',
	    value: function update(time) {
	      this.removeDeadChalklings();
	      this.updateHitboxes();
	      this.updateChalklingView();
	      this.removeDeadBindedRunes("Circle");
	      this.removeDeadBindedRunes("Line");
	      this.getBinded(function (rune) {
	        if (typeof rune.update != "undefined") {
	          rune.update(time);
	        }
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var renderedElements = [];
	      var allRunes = this.getBinded();
	      allRunes = allRunes.concat(this.renderSelected());
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = allRunes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var rune = _step.value;

	          var runeElements = rune.render();
	          for (var _i = 0; _i < runeElements.length; _i++) {
	            //Some render functions return multiple renderedElements, so go through all of them.
	            var tempElement = runeElements[_i];
	            var order = devConfig.renderOrder[tempElement.Type]; //Get the render order based on the current rune's type
	            if (renderedElements.length == 0) {
	              renderedElements.push(tempElement);
	            } else {
	              var inserted = false;
	              for (var j = 0; j < renderedElements.length; j++) {
	                var checkedElementOrder = devConfig.renderOrder[renderedElements[j].Type];
	                if (order < checkedElementOrder) {
	                  //We've searched too far in the array and found people with higher rendering order.
	                  renderedElements.splice(j, 0, tempElement); //Insert us at the end of our rendering section.
	                  inserted = true;
	                  break;
	                }
	              }
	              if (!inserted) {
	                //We are on the top of the rendering queue.
	                renderedElements.push(tempElement);
	              }
	            }
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

	      var renderString = '';
	      for (var i = 0; i < renderedElements.length; i++) {
	        renderString += renderedElements[i].RenderString;
	      }
	      return renderString;
	    }
	  }]);

	  return GameState;
	}();

	exports.default = GameState;

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

	var _renderedElement = __webpack_require__(9);

	var _renderedElement2 = _interopRequireDefault(_renderedElement);

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
	      var mode = arguments.length <= 0 || arguments[0] === undefined ? "DRAW" : arguments[0];

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
	      switch (mode) {
	        case "FILL":
	          return new _renderedElement2.default('<path stroke="black" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>', "Rune");
	          break;
	        case "DASH":
	          return new _renderedElement2.default('<path stroke="black" stroke-dasharray= "5,5" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>', "Rune");
	          break;
	        case "FADE":
	          return new _renderedElement2.default('<path stroke="grey" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>', "Rune");
	          break;
	        default:
	          return new _renderedElement2.default('<path stroke="black" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>', "Rune");

	      }
	    }
	  }]);

	  return Rune;
	}();

	exports.default = Rune;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var RenderedElement = function RenderedElement(renderString) {
	  var type = arguments.length <= 1 || arguments[1] === undefined ? "Rune" : arguments[1];

	  _classCallCheck(this, RenderedElement);

	  this.Type = type;
	  this.RenderString = renderString;
	};

	exports.default = RenderedElement;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _recognizer = __webpack_require__(2);

	var _recognizer2 = _interopRequireDefault(_recognizer);

	var _unit = __webpack_require__(11);

	var _unit2 = _interopRequireDefault(_unit);

	var _coord = __webpack_require__(3);

	var coord = _interopRequireWildcard(_coord);

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	var _sat = __webpack_require__(12);

	var SAT = _interopRequireWildcard(_sat);

	var _renderedElement = __webpack_require__(9);

	var _renderedElement2 = _interopRequireDefault(_renderedElement);

	var _rune = __webpack_require__(8);

	var _rune2 = _interopRequireDefault(_rune);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Circle = function (_Unit) {
		_inherits(Circle, _Unit);

		function Circle(points, id, player) {
			_classCallCheck(this, Circle);

			points.push(points[0]);
			//Close the circle

			var position = coord.Centroid(points);

			//Find the average distance (radius)
			var distances = 0;
			for (var i = 0; i < points.length; i++) {
				distances += coord.Distance(position, points[i]);
			}
			var radius = distances / points.length;
			points = coord.Resample(points, Math.round(radius));
			var MAX = Math.round(radius) * 10; //Health is related to the number of points (10 health per point) which is the Radius. E.g bigger circle = more points = more health
			var health = MAX;
			for (var _i = 0; _i < points.length; _i++) {
				//Deduct health for each point that's off center.
				var distance = coord.Distance(points[_i], position);
				health -= distance / radius;
				//This means that a big circle will allow for more error.
			}
			var attr = {
				"MaxHealth": MAX,
				"Health": health
			};

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).call(this, "Circle", id, player, position, attr));

			_this.Points = points;
			_this.Radius = radius;

			_this.HasBinded = [];
			return _this;
		}

		_createClass(Circle, [{
			key: 'toSATPolygon',
			value: function toSATPolygon() {
				var P = SAT.Polygon; //Shortening for easier typing
				var V = SAT.Vector;
				var pointArray = [];
				for (var i = 0; i < this.Points.length; i++) {
					pointArray.push(new V(this.Points[i].X, this.Points[i].Y));
				}
				var polygon = new P(new V(), pointArray);
				return polygon;
			}
		}, {
			key: 'averageDistanceFromCenter',
			value: function averageDistanceFromCenter() {
				var distances = 0;
				for (var i = 0; i < this.Points.length; i++) {
					distances += coord.Distance(new _point2.default(this.Position.X, this.Position.Y), this.Points[i]);
				}
				var avgDistance = distances / this.Points.length;
				return avgDistance;
			}
		}, {
			key: 'moveTo',
			value: function moveTo(point) {
				this.Points = coord.TranslateTo(this.Points, point);
				this.Position = point;
			}
		}, {
			key: 'getBinded',
			value: function getBinded() {
				var object = arguments.length <= 0 || arguments[0] === undefined ? "Circle" : arguments[0];
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
							this.getBindedIncursion(circle.HasBinded[i], object, binded);
						} else {}
					}
				} else {
					binded.push(circle);
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
				var radius = this.Radius;
				var r = radius.toString();

				var healthRatio = 1 - this.Attributes.Health / this.Attributes.MaxHealth;
				var strokeColor = "rgb(" + Math.round(healthRatio * 255).toString() + "," + Math.round(255 * (1 - healthRatio)).toString() + ",0)";

				//perfectCircle is the perfect circle shown for clarity
				//Circle formula for paths found here: http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334
				var perfectCircle = "<path fill='none' stroke='" + strokeColor + "' strokewidth=3 d='M" + this.Position.X + " " + this.Position.Y + "m" + (-1 * radius).toString() + " 0a" + r + "," + r + " 0 1,0 " + (radius * 2).toString() + ",0" + "a " + r + "," + r + " 0 1,0 " + (radius * -2).toString() + ",0" + "'></path>";
				var realCircle = new _rune2.default(this.Points).render();
				realCircle.Type = "CirclePoints";
				return [new _renderedElement2.default(perfectCircle, "CircleTrue"), realCircle];
			}
		}]);

		return Circle;
	}(_unit2.default);

	exports.default = Circle;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Unit = function () {
	  function Unit(name, id, player, position, attributes) {
	    _classCallCheck(this, Unit);

	    this.Name = name;
	    this.ID = id;
	    this.Player = player;
	    this.Position = position;
	    this.Attributes = attributes;
	    this.Attributes.Health = this.Attributes.MaxHealth;
	  }

	  _createClass(Unit, [{
	    key: "hasTags",
	    value: function hasTags() {
	      var tagsMatch = 0;

	      for (var _len = arguments.length, tags = Array(_len), _key = 0; _key < _len; _key++) {
	        tags[_key] = arguments[_key];
	      }

	      for (var i = 0; i < this.Attributes.Tags; i++) {
	        for (var j = 0; j < tagslength; j++) {
	          if (this.Attributes.Tags[i] == tags[j]) {
	            tagsMatch++;
	            if (tagsMatch == tags.length) {
	              return true;
	            }
	          }
	        }
	      }
	      return false;
	    }
	  }, {
	    key: "hasTag",
	    value: function hasTag(tag) {
	      for (var i = 0; i < this.Attributes.Tags; i++) {
	        if (this.Attributes.Tags[i] == tag) {
	          return true;
	        }
	      }
	      return false;
	    }
	    /*
	    Possible Tags include:
	      Hidden
	      Mobile
	      Destructible
	    */

	  }]);

	  return Unit;
	}();

	exports.default = Unit;

/***/ },
/* 12 */
/***/ function(module, exports) {

	// Version 0.5.0 - Copyright 2012 - 2015 -  Jim Riecken <jimr@jimr.ca>
	//
	// Released under the MIT License - https://github.com/jriecken/sat-js
	//
	// A simple library for determining intersections of circles and
	// polygons using the Separating Axis Theorem.
	/** @preserve SAT.js - Version 0.5.0 - Copyright 2012 - 2015 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */

	/*global define: false, module: false*/
	/*jshint shadow:true, sub:true, forin:true, noarg:true, noempty:true,
	eqeqeq:true, bitwise:true, strict:true, undef:true,
	curly:true, browser:true */

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Vector = Vector;
	exports.Circle = Circle;
	exports.Polygon = Polygon;
	exports.Box = Box;
	exports.Response = Response;
	exports.pointInCircle = pointInCircle;
	exports.pointInPolygon = pointInPolygon;
	exports.testCircleCircle = testCircleCircle;
	exports.testPolygonCircle = testPolygonCircle;
	exports.testCirclePolygon = testCirclePolygon;
	exports.testPolygonPolygon = testPolygonPolygon;
	var SAT = {};

	//
	// ## Vector
	//
	// Represents a vector in two dimensions with `x` and `y` properties.


	// Create a new Vector, optionally passing in the `x` and `y` coordinates. If
	// a coordinate is not specified, it will be set to `0`
	/**
	* @param {?number=} x The x position.
	* @param {?number=} y The y position.
	* @constructor
	*/
	function Vector(x, y) {
	  this['x'] = x || 0;
	  this['y'] = y || 0;
	}
	SAT['Vector'] = Vector;
	// Alias `Vector` as `V`
	SAT['V'] = Vector;

	// Copy the values of another Vector into this one.
	/**
	* @param {Vector} other The other Vector.
	* @return {Vector} This for chaining.
	*/
	Vector.prototype['copy'] = Vector.prototype.copy = function (other) {
	  this['x'] = other['x'];
	  this['y'] = other['y'];
	  return this;
	};

	// Create a new vector with the same coordinates as this on.
	/**
	* @return {Vector} The new cloned vector
	*/
	Vector.prototype['clone'] = Vector.prototype.clone = function () {
	  return new Vector(this['x'], this['y']);
	};

	// Change this vector to be perpendicular to what it was before. (Effectively
	// roatates it 90 degrees in a clockwise direction)
	/**
	* @return {Vector} This for chaining.
	*/
	Vector.prototype['perp'] = Vector.prototype.perp = function () {
	  var x = this['x'];
	  this['x'] = this['y'];
	  this['y'] = -x;
	  return this;
	};

	// Rotate this vector (counter-clockwise) by the specified angle (in radians).
	/**
	* @param {number} angle The angle to rotate (in radians)
	* @return {Vector} This for chaining.
	*/
	Vector.prototype['rotate'] = Vector.prototype.rotate = function (angle) {
	  var x = this['x'];
	  var y = this['y'];
	  this['x'] = x * Math.cos(angle) - y * Math.sin(angle);
	  this['y'] = x * Math.sin(angle) + y * Math.cos(angle);
	  return this;
	};

	// Reverse this vector.
	/**
	* @return {Vector} This for chaining.
	*/
	Vector.prototype['reverse'] = Vector.prototype.reverse = function () {
	  this['x'] = -this['x'];
	  this['y'] = -this['y'];
	  return this;
	};

	// Normalize this vector.  (make it have length of `1`)
	/**
	* @return {Vector} This for chaining.
	*/
	Vector.prototype['normalize'] = Vector.prototype.normalize = function () {
	  var d = this.len();
	  if (d > 0) {
	    this['x'] = this['x'] / d;
	    this['y'] = this['y'] / d;
	  }
	  return this;
	};

	// Add another vector to this one.
	/**
	* @param {Vector} other The other Vector.
	* @return {Vector} This for chaining.
	*/
	Vector.prototype['add'] = Vector.prototype.add = function (other) {
	  this['x'] += other['x'];
	  this['y'] += other['y'];
	  return this;
	};

	// Subtract another vector from this one.
	/**
	* @param {Vector} other The other Vector.
	* @return {Vector} This for chaiing.
	*/
	Vector.prototype['sub'] = Vector.prototype.sub = function (other) {
	  this['x'] -= other['x'];
	  this['y'] -= other['y'];
	  return this;
	};

	// Scale this vector. An independant scaling factor can be provided
	// for each axis, or a single scaling factor that will scale both `x` and `y`.
	/**
	* @param {number} x The scaling factor in the x direction.
	* @param {?number=} y The scaling factor in the y direction.  If this
	*   is not specified, the x scaling factor will be used.
	* @return {Vector} This for chaining.
	*/
	Vector.prototype['scale'] = Vector.prototype.scale = function (x, y) {
	  this['x'] *= x;
	  this['y'] *= y || x;
	  return this;
	};

	// Project this vector on to another vector.
	/**
	* @param {Vector} other The vector to project onto.
	* @return {Vector} This for chaining.
	*/
	Vector.prototype['project'] = Vector.prototype.project = function (other) {
	  var amt = this.dot(other) / other.len2();
	  this['x'] = amt * other['x'];
	  this['y'] = amt * other['y'];
	  return this;
	};

	// Project this vector onto a vector of unit length. This is slightly more efficient
	// than `project` when dealing with unit vectors.
	/**
	* @param {Vector} other The unit vector to project onto.
	* @return {Vector} This for chaining.
	*/
	Vector.prototype['projectN'] = Vector.prototype.projectN = function (other) {
	  var amt = this.dot(other);
	  this['x'] = amt * other['x'];
	  this['y'] = amt * other['y'];
	  return this;
	};

	// Reflect this vector on an arbitrary axis.
	/**
	* @param {Vector} axis The vector representing the axis.
	* @return {Vector} This for chaining.
	*/
	Vector.prototype['reflect'] = Vector.prototype.reflect = function (axis) {
	  var x = this['x'];
	  var y = this['y'];
	  this.project(axis).scale(2);
	  this['x'] -= x;
	  this['y'] -= y;
	  return this;
	};

	// Reflect this vector on an arbitrary axis (represented by a unit vector). This is
	// slightly more efficient than `reflect` when dealing with an axis that is a unit vector.
	/**
	* @param {Vector} axis The unit vector representing the axis.
	* @return {Vector} This for chaining.
	*/
	Vector.prototype['reflectN'] = Vector.prototype.reflectN = function (axis) {
	  var x = this['x'];
	  var y = this['y'];
	  this.projectN(axis).scale(2);
	  this['x'] -= x;
	  this['y'] -= y;
	  return this;
	};

	// Get the dot product of this vector and another.
	/**
	* @param {Vector}  other The vector to dot this one against.
	* @return {number} The dot product.
	*/
	Vector.prototype['dot'] = Vector.prototype.dot = function (other) {
	  return this['x'] * other['x'] + this['y'] * other['y'];
	};

	// Get the squared length of this vector.
	/**
	* @return {number} The length^2 of this vector.
	*/
	Vector.prototype['len2'] = Vector.prototype.len2 = function () {
	  return this.dot(this);
	};

	// Get the length of this vector.
	/**
	* @return {number} The length of this vector.
	*/
	Vector.prototype['len'] = Vector.prototype.len = function () {
	  return Math.sqrt(this.len2());
	};

	// ## Circle
	//
	// Represents a circle with a position and a radius.

	// Create a new circle, optionally passing in a position and/or radius. If no position
	// is given, the circle will be at `(0,0)`. If no radius is provided, the circle will
	// have a radius of `0`.
	/**
	* @param {Vector=} pos A vector representing the position of the center of the circle
	* @param {?number=} r The radius of the circle
	* @constructor
	*/
	function Circle(pos, r) {
	  this['pos'] = pos || new Vector();
	  this['r'] = r || 0;
	}
	SAT['Circle'] = Circle;

	// Compute the axis-aligned bounding box (AABB) of this Circle.
	//
	// Note: Returns a _new_ `Polygon` each time you call this.
	/**
	* @return {Polygon} The AABB
	*/
	Circle.prototype['getAABB'] = Circle.prototype.getAABB = function () {
	  var r = this['r'];
	  var corner = this["pos"].clone().sub(new Vector(r, r));
	  return new Box(corner, r * 2, r * 2).toPolygon();
	};

	// ## Polygon
	//
	// Represents a *convex* polygon with any number of points (specified in counter-clockwise order)
	//
	// Note: Do _not_ manually change the `points`, `angle`, or `offset` properties. Use the
	// provided setters. Otherwise the calculated properties will not be updated correctly.
	//
	// `pos` can be changed directly.

	// Create a new polygon, passing in a position vector, and an array of points (represented
	// by vectors relative to the position vector). If no position is passed in, the position
	// of the polygon will be `(0,0)`.
	/**
	* @param {Vector=} pos A vector representing the origin of the polygon. (all other
	*   points are relative to this one)
	* @param {Array.<Vector>=} points An array of vectors representing the points in the polygon,
	*   in counter-clockwise order.
	* @constructor
	*/
	function Polygon(pos, points) {
	  this['pos'] = pos || new Vector();
	  this['angle'] = 0;
	  this['offset'] = new Vector();
	  this.setPoints(points || []);
	}
	SAT['Polygon'] = Polygon;

	// Set the points of the polygon.
	/**
	* @param {Array.<Vector>=} points An array of vectors representing the points in the polygon,
	*   in counter-clockwise order.
	* @return {Polygon} This for chaining.
	*/
	Polygon.prototype['setPoints'] = Polygon.prototype.setPoints = function (points) {
	  // Only re-allocate if this is a new polygon or the number of points has changed.
	  var lengthChanged = !this['points'] || this['points'].length !== points.length;
	  if (lengthChanged) {
	    var i;
	    var calcPoints = this['calcPoints'] = [];
	    var edges = this['edges'] = [];
	    var normals = this['normals'] = [];
	    // Allocate the vector arrays for the calculated properties
	    for (i = 0; i < points.length; i++) {
	      calcPoints.push(new Vector());
	      edges.push(new Vector());
	      normals.push(new Vector());
	    }
	  }
	  this['points'] = points;
	  this._recalc();
	  return this;
	};

	// Set the current rotation angle of the polygon.
	/**
	* @param {number} angle The current rotation angle (in radians).
	* @return {Polygon} This for chaining.
	*/
	Polygon.prototype['setAngle'] = Polygon.prototype.setAngle = function (angle) {
	  this['angle'] = angle;
	  this._recalc();
	  return this;
	};

	// Set the current offset to apply to the `points` before applying the `angle` rotation.
	/**
	* @param {Vector} offset The new offset vector.
	* @return {Polygon} This for chaining.
	*/
	Polygon.prototype['setOffset'] = Polygon.prototype.setOffset = function (offset) {
	  this['offset'] = offset;
	  this._recalc();
	  return this;
	};

	// Rotates this polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).
	//
	// Note: This changes the **original** points (so any `angle` will be applied on top of this rotation).
	/**
	* @param {number} angle The angle to rotate (in radians)
	* @return {Polygon} This for chaining.
	*/
	Polygon.prototype['rotate'] = Polygon.prototype.rotate = function (angle) {
	  var points = this['points'];
	  var len = points.length;
	  for (var i = 0; i < len; i++) {
	    points[i].rotate(angle);
	  }
	  this._recalc();
	  return this;
	};

	// Translates the points of this polygon by a specified amount relative to the origin of *its own coordinate
	// system* (i.e. `pos`).
	//
	// This is most useful to change the "center point" of a polygon. If you just want to move the whole polygon, change
	// the coordinates of `pos`.
	//
	// Note: This changes the **original** points (so any `offset` will be applied on top of this translation)
	/**
	* @param {number} x The horizontal amount to translate.
	* @param {number} y The vertical amount to translate.
	* @return {Polygon} This for chaining.
	*/
	Polygon.prototype['translate'] = Polygon.prototype.translate = function (x, y) {
	  var points = this['points'];
	  var len = points.length;
	  for (var i = 0; i < len; i++) {
	    points[i].x += x;
	    points[i].y += y;
	  }
	  this._recalc();
	  return this;
	};

	// Computes the calculated collision polygon. Applies the `angle` and `offset` to the original points then recalculates the
	// edges and normals of the collision polygon.
	/**
	* @return {Polygon} This for chaining.
	*/
	Polygon.prototype._recalc = function () {
	  // Calculated points - this is what is used for underlying collisions and takes into account
	  // the angle/offset set on the polygon.
	  var calcPoints = this['calcPoints'];
	  // The edges here are the direction of the `n`th edge of the polygon, relative to
	  // the `n`th point. If you want to draw a given edge from the edge value, you must
	  // first translate to the position of the starting point.
	  var edges = this['edges'];
	  // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
	  // to the position of the `n`th point. If you want to draw an edge normal, you must first
	  // translate to the position of the starting point.
	  var normals = this['normals'];
	  // Copy the original points array and apply the offset/angle
	  var points = this['points'];
	  var offset = this['offset'];
	  var angle = this['angle'];
	  var len = points.length;
	  var i;
	  for (i = 0; i < len; i++) {
	    var calcPoint = calcPoints[i].copy(points[i]);
	    calcPoint.x += offset.x;
	    calcPoint.y += offset.y;
	    if (angle !== 0) {
	      calcPoint.rotate(angle);
	    }
	  }
	  // Calculate the edges/normals
	  for (i = 0; i < len; i++) {
	    var p1 = calcPoints[i];
	    var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];
	    var e = edges[i].copy(p2).sub(p1);
	    normals[i].copy(e).perp().normalize();
	  }
	  return this;
	};

	// Compute the axis-aligned bounding box. Any current state
	// (translations/rotations) will be applied before constructing the AABB.
	//
	// Note: Returns a _new_ `Polygon` each time you call this.
	/**
	* @return {Polygon} The AABB
	*/
	Polygon.prototype["getAABB"] = Polygon.prototype.getAABB = function () {
	  var points = this["calcPoints"];
	  var len = points.length;
	  var xMin = points[0]["x"];
	  var yMin = points[0]["y"];
	  var xMax = points[0]["x"];
	  var yMax = points[0]["y"];
	  for (var i = 1; i < len; i++) {
	    var point = points[i];
	    if (point["x"] < xMin) {
	      xMin = point["x"];
	    } else if (point["x"] > xMax) {
	      xMax = point["x"];
	    }
	    if (point["y"] < yMin) {
	      yMin = point["y"];
	    } else if (point["y"] > yMax) {
	      yMax = point["y"];
	    }
	  }
	  return new Box(this["pos"].clone().add(new Vector(xMin, yMin)), xMax - xMin, yMax - yMin).toPolygon();
	};

	// ## Box
	//
	// Represents an axis-aligned box, with a width and height.


	// Create a new box, with the specified position, width, and height. If no position
	// is given, the position will be `(0,0)`. If no width or height are given, they will
	// be set to `0`.
	/**
	* @param {Vector=} pos A vector representing the top-left of the box.
	* @param {?number=} w The width of the box.
	* @param {?number=} h The height of the box.
	* @constructor
	*/
	function Box(pos, w, h) {
	  this['pos'] = pos || new Vector();
	  this['w'] = w || 0;
	  this['h'] = h || 0;
	}
	SAT['Box'] = Box;

	// Returns a polygon whose edges are the same as this box.
	/**
	* @return {Polygon} A new Polygon that represents this box.
	*/
	Box.prototype['toPolygon'] = Box.prototype.toPolygon = function () {
	  var pos = this['pos'];
	  var w = this['w'];
	  var h = this['h'];
	  return new Polygon(new Vector(pos['x'], pos['y']), [new Vector(), new Vector(w, 0), new Vector(w, h), new Vector(0, h)]);
	};

	// ## Response
	//
	// An object representing the result of an intersection. Contains:
	//  - The two objects participating in the intersection
	//  - The vector representing the minimum change necessary to extract the first object
	//    from the second one (as well as a unit vector in that direction and the magnitude
	//    of the overlap)
	//  - Whether the first object is entirely inside the second, and vice versa.
	/**
	* @constructor
	*/
	function Response() {
	  this['a'] = null;
	  this['b'] = null;
	  this['overlapN'] = new Vector();
	  this['overlapV'] = new Vector();
	  this.clear();
	}
	SAT['Response'] = Response;

	// Set some values of the response back to their defaults.  Call this between tests if
	// you are going to reuse a single Response object for multiple intersection tests (recommented
	// as it will avoid allcating extra memory)
	/**
	* @return {Response} This for chaining
	*/
	Response.prototype['clear'] = Response.prototype.clear = function () {
	  this['aInB'] = true;
	  this['bInA'] = true;
	  this['overlap'] = Number.MAX_VALUE;
	  return this;
	};

	// ## Object Pools

	// A pool of `Vector` objects that are used in calculations to avoid
	// allocating memory.
	/**
	* @type {Array.<Vector>}
	*/
	var T_VECTORS = [];
	for (var i = 0; i < 10; i++) {
	  T_VECTORS.push(new Vector());
	}

	// A pool of arrays of numbers used in calculations to avoid allocating
	// memory.
	/**
	* @type {Array.<Array.<number>>}
	*/
	var T_ARRAYS = [];
	for (var i = 0; i < 5; i++) {
	  T_ARRAYS.push([]);
	}

	// Temporary response used for polygon hit detection.
	/**
	* @type {Response}
	*/
	var T_RESPONSE = new Response();

	// Unit square polygon used for polygon hit detection.
	/**
	* @type {Polygon}
	*/
	var UNIT_SQUARE = new Box(new Vector(), 1, 1).toPolygon();

	// ## Helper Functions

	// Flattens the specified array of points onto a unit vector axis,
	// resulting in a one dimensional range of the minimum and
	// maximum value on that axis.
	/**
	* @param {Array.<Vector>} points The points to flatten.
	* @param {Vector} normal The unit vector axis to flatten on.
	* @param {Array.<number>} result An array.  After calling this function,
	*   result[0] will be the minimum value,
	*   result[1] will be the maximum value.
	*/
	function flattenPointsOn(points, normal, result) {
	  var min = Number.MAX_VALUE;
	  var max = -Number.MAX_VALUE;
	  var len = points.length;
	  for (var i = 0; i < len; i++) {
	    // The magnitude of the projection of the point onto the normal
	    var dot = points[i].dot(normal);
	    if (dot < min) {
	      min = dot;
	    }
	    if (dot > max) {
	      max = dot;
	    }
	  }
	  result[0] = min;result[1] = max;
	}

	// Check whether two convex polygons are separated by the specified
	// axis (must be a unit vector).
	/**
	* @param {Vector} aPos The position of the first polygon.
	* @param {Vector} bPos The position of the second polygon.
	* @param {Array.<Vector>} aPoints The points in the first polygon.
	* @param {Array.<Vector>} bPoints The points in the second polygon.
	* @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
	*   will be projected onto this axis.
	* @param {Response=} response A Response object (optional) which will be populated
	*   if the axis is not a separating axis.
	* @return {boolean} true if it is a separating axis, false otherwise.  If false,
	*   and a response is passed in, information about how much overlap and
	*   the direction of the overlap will be populated.
	*/
	function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
	  var rangeA = T_ARRAYS.pop();
	  var rangeB = T_ARRAYS.pop();
	  // The magnitude of the offset between the two polygons
	  var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
	  var projectedOffset = offsetV.dot(axis);
	  // Project the polygons onto the axis.
	  flattenPointsOn(aPoints, axis, rangeA);
	  flattenPointsOn(bPoints, axis, rangeB);
	  // Move B's range to its position relative to A.
	  rangeB[0] += projectedOffset;
	  rangeB[1] += projectedOffset;
	  // Check if there is a gap. If there is, this is a separating axis and we can stop
	  if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
	    T_VECTORS.push(offsetV);
	    T_ARRAYS.push(rangeA);
	    T_ARRAYS.push(rangeB);
	    return true;
	  }
	  // This is not a separating axis. If we're calculating a response, calculate the overlap.
	  if (response) {
	    var overlap = 0;
	    // A starts further left than B
	    if (rangeA[0] < rangeB[0]) {
	      response['aInB'] = false;
	      // A ends before B does. We have to pull A out of B
	      if (rangeA[1] < rangeB[1]) {
	        overlap = rangeA[1] - rangeB[0];
	        response['bInA'] = false;
	        // B is fully inside A.  Pick the shortest way out.
	      } else {
	        var option1 = rangeA[1] - rangeB[0];
	        var option2 = rangeB[1] - rangeA[0];
	        overlap = option1 < option2 ? option1 : -option2;
	      }
	      // B starts further left than A
	    } else {
	      response['bInA'] = false;
	      // B ends before A ends. We have to push A out of B
	      if (rangeA[1] > rangeB[1]) {
	        overlap = rangeA[0] - rangeB[1];
	        response['aInB'] = false;
	        // A is fully inside B.  Pick the shortest way out.
	      } else {
	        var option1 = rangeA[1] - rangeB[0];
	        var option2 = rangeB[1] - rangeA[0];
	        overlap = option1 < option2 ? option1 : -option2;
	      }
	    }
	    // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
	    var absOverlap = Math.abs(overlap);
	    if (absOverlap < response['overlap']) {
	      response['overlap'] = absOverlap;
	      response['overlapN'].copy(axis);
	      if (overlap < 0) {
	        response['overlapN'].reverse();
	      }
	    }
	  }
	  T_VECTORS.push(offsetV);
	  T_ARRAYS.push(rangeA);
	  T_ARRAYS.push(rangeB);
	  return false;
	}

	// Calculates which Vornoi region a point is on a line segment.
	// It is assumed that both the line and the point are relative to `(0,0)`
	//
	//            |       (0)      |
	//     (-1)  [S]--------------[E]  (1)
	//            |       (0)      |
	/**
	* @param {Vector} line The line segment.
	* @param {Vector} point The point.
	* @return  {number} LEFT_VORNOI_REGION (-1) if it is the left region,
	*          MIDDLE_VORNOI_REGION (0) if it is the middle region,
	*          RIGHT_VORNOI_REGION (1) if it is the right region.
	*/
	function vornoiRegion(line, point) {
	  var len2 = line.len2();
	  var dp = point.dot(line);
	  // If the point is beyond the start of the line, it is in the
	  // left vornoi region.
	  if (dp < 0) {
	    return LEFT_VORNOI_REGION;
	  }
	  // If the point is beyond the end of the line, it is in the
	  // right vornoi region.
	  else if (dp > len2) {
	      return RIGHT_VORNOI_REGION;
	    }
	    // Otherwise, it's in the middle one.
	    else {
	        return MIDDLE_VORNOI_REGION;
	      }
	}
	// Constants for Vornoi regions
	/**
	* @const
	*/
	var LEFT_VORNOI_REGION = -1;
	/**
	* @const
	*/
	var MIDDLE_VORNOI_REGION = 0;
	/**
	* @const
	*/
	var RIGHT_VORNOI_REGION = 1;

	// ## Collision Tests

	// Check if a point is inside a circle.
	/**
	* @param {Vector} p The point to test.
	* @param {Circle} c The circle to test.
	* @return {boolean} true if the point is inside the circle, false if it is not.
	*/
	function pointInCircle(p, c) {
	  var differenceV = T_VECTORS.pop().copy(p).sub(c['pos']);
	  var radiusSq = c['r'] * c['r'];
	  var distanceSq = differenceV.len2();
	  T_VECTORS.push(differenceV);
	  // If the distance between is smaller than the radius then the point is inside the circle.
	  return distanceSq <= radiusSq;
	}
	SAT['pointInCircle'] = pointInCircle;

	// Check if a point is inside a convex polygon.
	/**
	* @param {Vector} p The point to test.
	* @param {Polygon} poly The polygon to test.
	* @return {boolean} true if the point is inside the polygon, false if it is not.
	*/
	function pointInPolygon(p, poly) {
	  UNIT_SQUARE['pos'].copy(p);
	  T_RESPONSE.clear();
	  var result = testPolygonPolygon(UNIT_SQUARE, poly, T_RESPONSE);
	  if (result) {
	    result = T_RESPONSE['aInB'];
	  }
	  return result;
	}
	SAT['pointInPolygon'] = pointInPolygon;

	// Check if two circles collide.
	/**
	* @param {Circle} a The first circle.
	* @param {Circle} b The second circle.
	* @param {Response=} response Response object (optional) that will be populated if
	*   the circles intersect.
	* @return {boolean} true if the circles intersect, false if they don't.
	*/
	function testCircleCircle(a, b, response) {
	  // Check if the distance between the centers of the two
	  // circles is greater than their combined radius.
	  var differenceV = T_VECTORS.pop().copy(b['pos']).sub(a['pos']);
	  var totalRadius = a['r'] + b['r'];
	  var totalRadiusSq = totalRadius * totalRadius;
	  var distanceSq = differenceV.len2();
	  // If the distance is bigger than the combined radius, they don't intersect.
	  if (distanceSq > totalRadiusSq) {
	    T_VECTORS.push(differenceV);
	    return false;
	  }
	  // They intersect.  If we're calculating a response, calculate the overlap.
	  if (response) {
	    var dist = Math.sqrt(distanceSq);
	    response['a'] = a;
	    response['b'] = b;
	    response['overlap'] = totalRadius - dist;
	    response['overlapN'].copy(differenceV.normalize());
	    response['overlapV'].copy(differenceV).scale(response['overlap']);
	    response['aInB'] = a['r'] <= b['r'] && dist <= b['r'] - a['r'];
	    response['bInA'] = b['r'] <= a['r'] && dist <= a['r'] - b['r'];
	  }
	  T_VECTORS.push(differenceV);
	  return true;
	}
	SAT['testCircleCircle'] = testCircleCircle;

	// Check if a polygon and a circle collide.
	/**
	* @param {Polygon} polygon The polygon.
	* @param {Circle} circle The circle.
	* @param {Response=} response Response object (optional) that will be populated if
	*   they interset.
	* @return {boolean} true if they intersect, false if they don't.
	*/
	function testPolygonCircle(polygon, circle, response) {
	  // Get the position of the circle relative to the polygon.
	  var circlePos = T_VECTORS.pop().copy(circle['pos']).sub(polygon['pos']);
	  var radius = circle['r'];
	  var radius2 = radius * radius;
	  var points = polygon['calcPoints'];
	  var len = points.length;
	  var edge = T_VECTORS.pop();
	  var point = T_VECTORS.pop();

	  // For each edge in the polygon:
	  for (var i = 0; i < len; i++) {
	    var next = i === len - 1 ? 0 : i + 1;
	    var prev = i === 0 ? len - 1 : i - 1;
	    var overlap = 0;
	    var overlapN = null;

	    // Get the edge.
	    edge.copy(polygon['edges'][i]);
	    // Calculate the center of the circle relative to the starting point of the edge.
	    point.copy(circlePos).sub(points[i]);

	    // If the distance between the center of the circle and the point
	    // is bigger than the radius, the polygon is definitely not fully in
	    // the circle.
	    if (response && point.len2() > radius2) {
	      response['aInB'] = false;
	    }

	    // Calculate which Vornoi region the center of the circle is in.
	    var region = vornoiRegion(edge, point);
	    // If it's the left region:
	    if (region === LEFT_VORNOI_REGION) {
	      // We need to make sure we're in the RIGHT_VORNOI_REGION of the previous edge.
	      edge.copy(polygon['edges'][prev]);
	      // Calculate the center of the circle relative the starting point of the previous edge
	      var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
	      region = vornoiRegion(edge, point2);
	      if (region === RIGHT_VORNOI_REGION) {
	        // It's in the region we want.  Check if the circle intersects the point.
	        var dist = point.len();
	        if (dist > radius) {
	          // No intersection
	          T_VECTORS.push(circlePos);
	          T_VECTORS.push(edge);
	          T_VECTORS.push(point);
	          T_VECTORS.push(point2);
	          return false;
	        } else if (response) {
	          // It intersects, calculate the overlap.
	          response['bInA'] = false;
	          overlapN = point.normalize();
	          overlap = radius - dist;
	        }
	      }
	      T_VECTORS.push(point2);
	      // If it's the right region:
	    } else if (region === RIGHT_VORNOI_REGION) {
	      // We need to make sure we're in the left region on the next edge
	      edge.copy(polygon['edges'][next]);
	      // Calculate the center of the circle relative to the starting point of the next edge.
	      point.copy(circlePos).sub(points[next]);
	      region = vornoiRegion(edge, point);
	      if (region === LEFT_VORNOI_REGION) {
	        // It's in the region we want.  Check if the circle intersects the point.
	        var dist = point.len();
	        if (dist > radius) {
	          // No intersection
	          T_VECTORS.push(circlePos);
	          T_VECTORS.push(edge);
	          T_VECTORS.push(point);
	          return false;
	        } else if (response) {
	          // It intersects, calculate the overlap.
	          response['bInA'] = false;
	          overlapN = point.normalize();
	          overlap = radius - dist;
	        }
	      }
	      // Otherwise, it's the middle region:
	    } else {
	      // Need to check if the circle is intersecting the edge,
	      // Change the edge into its "edge normal".
	      var normal = edge.perp().normalize();
	      // Find the perpendicular distance between the center of the
	      // circle and the edge.
	      var dist = point.dot(normal);
	      var distAbs = Math.abs(dist);
	      // If the circle is on the outside of the edge, there is no intersection.
	      if (dist > 0 && distAbs > radius) {
	        // No intersection
	        T_VECTORS.push(circlePos);
	        T_VECTORS.push(normal);
	        T_VECTORS.push(point);
	        return false;
	      } else if (response) {
	        // It intersects, calculate the overlap.
	        overlapN = normal;
	        overlap = radius - dist;
	        // If the center of the circle is on the outside of the edge, or part of the
	        // circle is on the outside, the circle is not fully inside the polygon.
	        if (dist >= 0 || overlap < 2 * radius) {
	          response['bInA'] = false;
	        }
	      }
	    }

	    // If this is the smallest overlap we've seen, keep it.
	    // (overlapN may be null if the circle was in the wrong Vornoi region).
	    if (overlapN && response && Math.abs(overlap) < Math.abs(response['overlap'])) {
	      response['overlap'] = overlap;
	      response['overlapN'].copy(overlapN);
	    }
	  }

	  // Calculate the final overlap vector - based on the smallest overlap.
	  if (response) {
	    response['a'] = polygon;
	    response['b'] = circle;
	    response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
	  }
	  T_VECTORS.push(circlePos);
	  T_VECTORS.push(edge);
	  T_VECTORS.push(point);
	  return true;
	}
	SAT['testPolygonCircle'] = testPolygonCircle;

	// Check if a circle and a polygon collide.
	//
	// **NOTE:** This is slightly less efficient than polygonCircle as it just
	// runs polygonCircle and reverses everything at the end.
	/**
	* @param {Circle} circle The circle.
	* @param {Polygon} polygon The polygon.
	* @param {Response=} response Response object (optional) that will be populated if
	*   they interset.
	* @return {boolean} true if they intersect, false if they don't.
	*/
	function testCirclePolygon(circle, polygon, response) {
	  // Test the polygon against the circle.
	  var result = testPolygonCircle(polygon, circle, response);
	  if (result && response) {
	    // Swap A and B in the response.
	    var a = response['a'];
	    var aInB = response['aInB'];
	    response['overlapN'].reverse();
	    response['overlapV'].reverse();
	    response['a'] = response['b'];
	    response['b'] = a;
	    response['aInB'] = response['bInA'];
	    response['bInA'] = aInB;
	  }
	  return result;
	}
	SAT['testCirclePolygon'] = testCirclePolygon;

	// Checks whether polygons collide.
	/**
	* @param {Polygon} a The first polygon.
	* @param {Polygon} b The second polygon.
	* @param {Response=} response Response object (optional) that will be populated if
	*   they interset.
	* @return {boolean} true if they intersect, false if they don't.
	*/
	function testPolygonPolygon(a, b, response) {
	  var aPoints = a['calcPoints'];
	  var aLen = aPoints.length;
	  var bPoints = b['calcPoints'];
	  var bLen = bPoints.length;
	  // If any of the edge normals of A is a separating axis, no intersection.
	  for (var i = 0; i < aLen; i++) {
	    if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, a['normals'][i], response)) {
	      return false;
	    }
	  }
	  // If any of the edge normals of B is a separating axis, no intersection.
	  for (var i = 0; i < bLen; i++) {
	    if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, b['normals'][i], response)) {
	      return false;
	    }
	  }
	  // Since none of the edge normals of A or B are a separating axis, there is an intersection
	  // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
	  // final overlap vector.
	  if (response) {
	    response['a'] = a;
	    response['b'] = b;
	    response['overlapV'] = response['overlapN'].scale(response['overlap']);
	  }
	  return true;
	}
	SAT['testPolygonPolygon'] = testPolygonPolygon;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Testling = undefined;

	var _chalkling = __webpack_require__(14);

	var _chalkling2 = _interopRequireDefault(_chalkling);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Testling = exports.Testling = function (_Chalkling) {
	  _inherits(Testling, _Chalkling);

	  function Testling(id, player, position) {
	    _classCallCheck(this, Testling);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Testling).call(this, "Testling", id, player, position, {
	      "MaxHealth": 100,
	      "Attack": 10,
	      "AttackRange": 200,
	      "MovementSpeed": 100,
	      "ViewRange": 3000,
	      "AnimationData": {
	        "IDLE": {
	          "Frames": 1,
	          "Time": 1000,
	          "Size": {
	            "X": 259,
	            "Y": 194
	          }
	        },
	        "WALK": {
	          "Frames": 6,
	          "Time": 800,
	          "Size": {
	            "X": 1500,
	            "Y": 250
	          }
	        },
	        "ATTACK": {
	          "Frames": 83,
	          "Time": 10000,
	          "Size": {
	            "X": 124500,
	            "Y": 1000
	          } },
	        "DYING": {
	          "Frames": 19,
	          "Time": 1000,
	          "Width": 350
	        }
	      },
	      "Tags": ["Mobile", "Destructible"]
	    }));
	  }

	  return Testling;
	}(_chalkling2.default);

/***/ },
/* 14 */
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

	var _renderedElement = __webpack_require__(9);

	var _renderedElement2 = _interopRequireDefault(_renderedElement);

	var _unit = __webpack_require__(11);

	var _unit2 = _interopRequireDefault(_unit);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Chalkling = function (_Unit) {
	  _inherits(Chalkling, _Unit);

	  function Chalkling(name, id, player, position, attributeSet) {
	    _classCallCheck(this, Chalkling);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chalkling).call(this, name, id, player, position, attributeSet));

	    _this.CurrentAction = "IDLE";
	    _this.Frame = 0;
	    _this.Sees = [];
	    _this.TimeSinceAnimationStarted = 0;
	    _this.Target = null;
	    _this.Path = [];
	    _this.TopLeft = new _point2.default(_this.Position.X - 50, _this.Position.Y - 50);
	    return _this;
	  }

	  _createClass(Chalkling, [{
	    key: 'getAnimation',
	    value: function getAnimation() {
	      //Example path: ./chalklings/Testling/Animations/Idle/X
	      var pathToAnimation = '';
	      switch (this.CurrentAction) {
	        /*
	        The reason for the frame+1 and parenthesis is because I can take a group of png files, selected them all, and then rename using f2/
	        If I put no name in, it names them (1), (2), etc.
	         */
	        case "IDLE":
	          pathToAnimation = './chalklings/' + this.Name + '/Animations/Idle.png';
	          break;
	        case "WALK":
	          pathToAnimation = './chalklings/' + this.Name + '/Animations/Walk.png';
	          break;
	        case "ATTACK":
	          pathToAnimation = './chalklings/' + this.Name + '/Animations/Attack.png';
	          break;
	        case "DYING":
	          pathToAnimation = './chalklings/' + this.Name + '/Animations/Dying/(' + (this.Frame + 1) + ").png";
	          break;
	        case "DEATH":
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
	    key: 'moveTo',
	    value: function moveTo(position) {
	      this.Target = null;
	      this.CurrentAction = "WALK";
	      this.Path = [position];
	    }
	  }, {
	    key: 'moveAlongPath',
	    value: function moveAlongPath(path) {
	      //Path is array of points
	      this.Target = null;
	      this.CurrentAction = "WALK";
	      this.Path = path;
	    }
	  }, {
	    key: 'die',
	    value: function die() {
	      this.CurrentAction = "DYING";
	      this.Frame = 0;
	      this.TimeSinceAnimationStarted = 0;
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
	    key: 'override',
	    value: function override() {
	      this.CurrentAction = "IDLE";
	      this.Path = [];
	      this.Frame = 0;
	      this.Target = null;
	    }
	  }, {
	    key: 'update',
	    value: function update(time) {
	      //Update topleft
	      this.TopLeft = new _point2.default(this.Position.X - 50, this.Position.Y - 50);
	      //Calculate the current frame.
	      var newTime = this.TimeSinceAnimationStarted + time; //Get the new time since the animation started
	      var numFrames = this.Attributes.AnimationData[this.CurrentAction].Frames;
	      var animationTime = this.Attributes.AnimationData[this.CurrentAction].Time;
	      var framesPerSecond = numFrames / animationTime;
	      this.Frame = Math.min(Math.round(newTime * framesPerSecond), numFrames - 1); //Don't round up if we're out of frames. The -1 is because we start at frame 0;
	      this.TimeSinceAnimationStarted = newTime;

	      if (newTime > animationTime) {
	        //Is my animation done?
	        if (this.CurrentAction == "ATTACK") {
	          //So I'm attacking someone and I just finished an attack animation. Should I continue?
	          if (this.Target.Attributes.Health > 0) {
	            //My enemy is alive! Time to finish the job.
	            this.Target.Attributes.Health -= this.Attributes.Attack;
	          } else {
	            this.CurrentAction = "IDLE";
	          }
	        } else if (this.CurrentAction == "DYING") {
	          console.log("DEAD");
	          this.CurrentAction = "DEATH";
	        }
	        this.Frame = 0;
	        this.TimeSinceAnimationStarted = 0;
	      }
	      if (this.CurrentAction == "DYING" || this.CurrentAction == "DEATH") {
	        return;
	      }
	      if (this.Attributes.Health <= 0 && this.CurrentAction != "DYING") {
	        //Is it dead?
	        this.die();
	        return;
	      }

	      for (var i = 0; i < this.Attributes.Modifiers; i++) {
	        //Can any of it's modifiers be applied?
	        var currentModifier = this.Attributes.Modifiers[i];
	        if (currentModifier.Condition(this) == true) {
	          currentModifier.AttributeChange(this);
	        }
	      }
	      if (this.Path.length != 0) {
	        //Am I currently going somewhere?
	        var distanceToMove = time / 1000 * this.Attributes.MovementSpeed;
	        this.Position = coord.movePointAlongLine(this.Position, this.Path[0], distanceToMove);
	        if (coord.Distance(this.Position, this.Path[0]) < distanceToMove) {
	          //Did I make it where I need to go?
	          this.Path.shift();
	        }
	      } else {
	        //Finished my path, go into idle.
	        this.CurrentAction = "IDLE";
	      }
	      if (this.Target == null && this.getNearbyEnemies().length != 0 && this.CurrentAction == "IDLE") {
	        //Is there a nearby enemy I can attack?
	        var nearbyEnemies = this.getNearbyEnemies();
	        var closestEnemy = null;
	        var closestEnemyDistance = Infinity;
	        for (var _i = 0; _i < nearbyEnemies.length; _i++) {
	          if (nearbyEnemies[_i].hasTag("Hidden")) {
	            //Don't bother looking at nearby people if they're hidden.
	            continue;
	          }
	          var currentDistance = coord.Distance(this.Position, nearbyEnemies[_i].Position);
	          if (currentDistance < closestEnemyDistance) {
	            closestEnemy = nearbyEnemies[_i];
	            closestEnemyDistance = currentDistance;
	          }
	        }
	        this.Target = closestEnemy;
	      }
	      if (this.Target != null) {
	        //If there's a target:
	        if (this.Target.CurrentAction == "DEATH" || this.Target.Attributes.Health <= 0) {
	          //Whoops, he's dead. Lets not bother him any more.
	          this.Target = null;
	        } else if (coord.Distance(this.Target.Position, this.Position) >= this.Attributes.ViewRange) {
	          //Can i still see the target?
	          this.Target = null;
	          this.CurrentAction = "IDLE";
	        } else if (coord.Distance(this.Target.Position, this.Position) <= this.Attributes.AttackRange) {
	          //Should I move to follow my target?
	          if (this.CurrentAction != "ATTACK") {
	            //If we aren't already attacking...
	            this.Path = [];
	            this.CurrentAction = "ATTACK";
	          }
	        } else {
	          //Follow him!
	          this.CurrentAction = "WALK";
	          this.moveTo(this.Target.Position);
	        }
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      //The way we render only a section of the spritesheet is to embed it in another svg and set the viewbox.
	      //Other methods here: http://stackoverflow.com/questions/16983442/how-to-specify-the-portion-of-the-image-to-be-rendered-inside-svgimage-tag

	      var totalWidth = this.Attributes.AnimationData[this.CurrentAction].Size.X;
	      var frameWidth = totalWidth / this.Attributes.AnimationData[this.CurrentAction].Frames;
	      var frameHeight = this.Attributes.AnimationData[this.CurrentAction].Size.Y;
	      var viewBox = (frameWidth * this.Frame).toString() + " 0 " + frameWidth.toString() + " " + frameHeight.toString();
	      var chalklingImage = "<svg x=\"" + this.TopLeft.X + "\" y=\"" + this.TopLeft.Y + "\" width=\"100px\" height=\"100px\" viewBox=\"" + viewBox + "\">" + "<image x=\"0px\" y=\"0px\" width=\"" + totalWidth.toString() + "\" height=\"" + frameHeight + "\" xlink:href=\"" + this.getAnimation() + "\"" + "/></svg>";
	      var healthBarOutside = '<rect x="' + this.TopLeft.X.toString() + '" y="' + (this.TopLeft.Y + 110).toString() + '" width="100" height="5" fill="green"/>';
	      var healthRatio = Math.max(0, (this.Attributes.MaxHealth - this.Attributes.Health) / this.Attributes.MaxHealth * 100);
	      var healthBarLeft = '<rect x="' + (this.TopLeft.X + (100 - healthRatio)).toString() + '" y="' + (this.TopLeft.Y + 110).toString() + '" width="' + healthRatio.toString() + '" height="5" fill="red"/>';
	      var healthBarTotal = healthBarOutside + healthBarLeft;
	      return [new _renderedElement2.default(chalklingImage, "ChalklingImage"), new _renderedElement2.default(healthBarTotal, "ChalklingHealth")];
	    }
	  }]);

	  return Chalkling;
	}(_unit2.default);

	exports.default = Chalkling;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _unit = __webpack_require__(11);

	var _unit2 = _interopRequireDefault(_unit);

	var _renderedElement = __webpack_require__(9);

	var _renderedElement2 = _interopRequireDefault(_renderedElement);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Line = function (_Unit) {
	  _inherits(Line, _Unit);

	  function Line(point1, point2, id, player) {
	    _classCallCheck(this, Line);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Line).call(this, "Line", id, player, point1, {
	      "MaxHealth": 50,
	      "Health": 50,
	      "Tags": ["Destructible", "Hidden"]
	    }));

	    _this.Point1 = point1;
	    _this.Point2 = point2;
	    return _this;
	  }

	  _createClass(Line, [{
	    key: 'render',
	    value: function render() {
	      var renderString = "<line x1=\"" + this.Point1.X + "\" y1=\"" + this.Point1.Y + "\" x2=\"" + this.Point2.X + "\" y2=\"" + this.Point2.Y + "\" stroke-width=\"1\" stroke=\"black\"/>";
	      var element = new _renderedElement2.default(renderString, "Line");
	      return [element];
	    }
	  }]);

	  return Line;
	}(_unit2.default);

	exports.default = Line;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _renderedElement = __webpack_require__(9);

	var _renderedElement2 = _interopRequireDefault(_renderedElement);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SelectedOverlay = function () {
	  function SelectedOverlay(position) {
	    _classCallCheck(this, SelectedOverlay);

	    this.Position = position;
	  }

	  _createClass(SelectedOverlay, [{
	    key: "render",
	    value: function render() {
	      return [new _renderedElement2.default("<rect x=\"" + (this.Position.X - 5).toString() + "\" y= \"" + (this.Position.Y - 5).toString() + "\" width = \"110\" height=\"110\" style=\"fill:gold\"/>", "SelectedOutline")];
	    }
	  }]);

	  return SelectedOverlay;
	}();

	exports.default = SelectedOverlay;

/***/ }
/******/ ]);