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
					} else if (mouseDownEvent.button === 0 && _this.Mode == "SELECTION") {
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
	exports.findIntersectionPoint = exports.movePointAlongLine = exports.CloudDistance = exports.Resample = exports.Scale = exports.TranslateTo = exports.GreedyCloudMatch = exports.Centroid = exports.PathDistance = exports.PathLength = exports.Distance = undefined;

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
	function findIntersectionPoint(line1, line2) {
		//http://stackoverflow.com/a/565282/6283767
		var p = line1[0];
		var q = line2[0];
		var r = line1[1].subtract(line1[0]);
		var s = line2[1].subtract(line2[0]);
		var t = q.subtract(p).crossProduct(s) / r.crossProduct(s);
		var u = q.subtract(p).crossProduct(r) / r.crossProduct(s);
		if (line1[0] === line2[0] || line1[1] === line2[0] || line1[0] === line2[1] || line1[1] === line2[1]) {
			//They're touching each other on the edge
			return new _point2.default(0, 0);
		} else if (r.crossProduct(s) === 0 && q.subtract(p).crossProduct(r) === 0) {
			//Collinear
			return new _point2.default(0, 0);
		} else if (r.crossProduct(s) === 0 && q.subtract(p).crossProduct(r) !== 0) {
			//Parallel lines
			return new _point2.default(0, 0);
		} else if (r.crossProduct(s) !== 0 && 0 <= t && t <= 1 && 0 <= u && u <= 1) {
			var newP = p.add(r.scale(t));
			return newP;
		} else {
			return new _point2.default(0, 0);
		}
	}

	function movePointAlongLine(pt1, pt2, distanceToMove, percent) {
		var dx = pt2.X - pt1.X;
		var dy = pt2.Y - pt1.Y;
		var distance = Distance(pt1, pt2);
		var unitX = dx / distance;
		var unitY = dy / distance;
		var unitDistance = percent ? distanceToMove * distance : distanceToMove;
		var newX = unitX * unitDistance + pt1.X;
		var newY = unitY * unitDistance + pt1.Y;
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
		var newpoints = [];
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
		var newpoints = [];
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
	exports.findIntersectionPoint = findIntersectionPoint;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Point = function () {
		function Point(x, y, id) {
			_classCallCheck(this, Point);

			this.X = x;
			this.Y = y;
			this.ID = id; // stroke ID to which this point belongs (1,2,...)
		}

		_createClass(Point, [{
			key: "add",
			value: function add(point) {
				return new Point(this.X + point.X, this.Y + point.Y);
			}
		}, {
			key: "subtract",
			value: function subtract(point) {
				return new Point(this.X - point.X, this.Y - point.Y);
			}
		}, {
			key: "crossProduct",
			value: function crossProduct(point) {
				return this.X * point.Y - this.Y * point.X;
			}
		}, {
			key: "scale",
			value: function scale(factor) {
				return new Point(this.X * factor, this.Y * factor);
			}
		}, {
			key: "isZero",
			value: function isZero() {
				return this.X === 0 && this.Y === 0;
			}
		}]);

		return Point;
	}();

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
				if (this.Selected[0] !== null) {
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
			key: 'doCircleChalklingCollision',
			value: function doCircleChalklingCollision(circle, chalkling) {
				var response = new SAT.Response();
				if (SAT.testPolygonPolygon(new SAT.Box(new SAT.Vector(chalkling.TopLeft.X, chalkling.TopLeft.Y), 100, 100).toPolygon(), circle.toSATPolygon(), response)) {
					if (response.overlapV.x === 0 && response.overlapV.y === 0) {
						//We're on the border, colliding but not moving
						chalkling.Position.X -= 1;
						chalkling.Position.Y -= 1;
					} else {
						chalkling.Position.X -= response.overlapV.x / 2;
						chalkling.Position.Y -= response.overlapV.y / 2;
					}
					chalkling.override();
				}
			}
		}, {
			key: 'updateHitboxes',
			value: function updateHitboxes() {
				var runes = this.getBinded();
				for (var i = 0; i < runes.length; i++) {
					for (var j = 0; j < runes.length; j++) {
						if (i == j) {
							//Don't want to compare to ourselves.
							continue;
						}
						var entity1 = runes[i];
						var entity2 = runes[j];
						if (entity1.constructor.name == "Circle" || entity2.constructor.name == "Circle") {
							//One's a circle
							if (entity1.constructor.name == "Circle" && entity2.constructor.name == "Circle") {//Both circles

							} else if (entity1.constructor.name == "Circle") {
								if (this.isChalkling(entity2)) {
									//2 is chalkling, 1 is circle
									this.doCircleChalklingCollision(entity1, entity2);
								}
							} else if (entity2.constructor.name == "Circle") {
								if (this.isChalkling(entity1)) {
									//1 is chalkling, 2 is circle
									this.doCircleChalklingCollision(entity2, entity1);
								}
							} else if (entity1.constructor.name == "Line") {} else {//God help us everything is broken

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
							if (renderedElements.length === 0) {
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
					case "DASH":
						return new _renderedElement2.default('<path stroke="black" stroke-dasharray= "5,5" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>', "Rune");
					case "FADE":
						return new _renderedElement2.default('<path stroke="grey" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>', "Rune");
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

	var _renderedElement = __webpack_require__(9);

	var _renderedElement2 = _interopRequireDefault(_renderedElement);

	var _rune = __webpack_require__(8);

	var _rune2 = _interopRequireDefault(_rune);

	var _polyDecomp = __webpack_require__(12);

	var decomp = _interopRequireWildcard(_polyDecomp);

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
			_this.toSimplePolygon();
			_this.HasBinded = [];
			return _this;
		}

		_createClass(Circle, [{
			key: 'toSimplePolygon',
			value: function toSimplePolygon() {
				//When someone draws lines they can be complex (self-intersecting) which makes it impossible to detect collisions.
				var newPoints = [this.Points[0], this.Points[1], this.Points[2]];
				var poly = new SAT.Polygon(new SAT.Vector(), []);
				var inComplexArea = false;
				for (var i = 3; i < this.Points.length; i++) {
					var currentLine = [this.Points[i], this.Points[i - 1]];
					for (var j = 1; j < newPoints.length; j++) {
						var checkedLine = [newPoints[j], newPoints[j - 1]];
						var possibleIntersectPoint = coord.findIntersectionPoint(currentLine, checkedLine);
						if (!possibleIntersectPoint.isZero() && i != this.Points.length) {
							//It intersects with a line already checked that's not the closing line.
							console.log("INTER");
							inComplexArea = !inComplexArea;
						} else {//No intersection

						}
					}
					if (!inComplexArea) {
						//We're not currently checking points on the outside that will be removed.
						newPoints.push(this.Points[i]);
					}
				}
				this.Points = newPoints;
			}
		}, {
			key: 'getConvexPolygons',
			value: function getConvexPolygons() {
				var P = SAT.Polygon; //Shortening for easier typing
				var V = SAT.Vector;
				var pointArray = [];
				for (var i = 0; i < this.Points.length; i++) {
					pointArray.push(new V(this.Points[i].X, this.Points[i].Y));
				}
				var polygon = new P(new V(), pointArray);
				decomp.quickDecomp([[-1, 1], [-1, 0], [1, 0], [1, 1], [0.5, 0.5]]);
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
				if (circle.HasBinded.length !== 0) {
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

	module.exports = require("poly-decomp");

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
						"Frames": 17,
						"Time": 2000,
						"Size": {
							"X": 10850,
							"Y": 374
						}
					},
					"DYING": {
						"Frames": 19,
						"Time": 1000,
						"Size": {
							"X": 6650,
							"Y": 250
						}
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
						pathToAnimation = './chalklings/' + this.Name + '/Animations/Dying.png';
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
					if (currentModifier.Condition(this) === true) {
						currentModifier.AttributeChange(this);
					}
				}
				if (this.Path.length !== 0) {
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
				if (this.Target === null && this.getNearbyEnemies().length !== 0 && this.CurrentAction == "IDLE") {
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
				if (this.Target !== null) {
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
				if (this.CurrentAction == "DEATH") {
					return [];
				}
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