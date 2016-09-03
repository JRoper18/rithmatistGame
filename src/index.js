console.log(`hello world from ${__dirname}`);
import Canvas from './es6-dev/canvas.js';
import GameState from './es6-dev/gameState.js';
import Circle from './es6-dev/circle.js';
import {
	getUserRunes
} from './es6-dev/runeData.js';
let b, c;
let lastFrameTime = 0;

window.onload = function() {
	b = new GameState('content');
	c = new Canvas(b, ["circle", "attack"]);
	requestAnimationFrame(gameLoop);
};

function gameLoop(timeStamp) {
	let changeInTime = (timeStamp - lastFrameTime);
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
	document.getElementById(b.element).innerHTML = (svgElements);
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
			window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
					callback(currTime + timeToCall);
				},
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());
