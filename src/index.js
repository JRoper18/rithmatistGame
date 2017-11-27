console.log(`hello world from ${__dirname}`);
import Canvas from './es6-dev/canvas.js';
import GameState from './es6-dev/gameState.js';
import Circle from './es6-dev/circle.js';
import Minimap from './es6-dev/minimap.js';
import Renderer from './es6-dev/renderer.js';
import {
	getUserRunes
} from './es6-dev/runeData.js';
let b, c, m;
let lastFrameTime = 0;

window.onload = function() {
	window.renderer = new Renderer("test");
	window.gameState = new GameState({
		"x": 720,
		"y": 1000
	});
	c = new Canvas(["circle", "attack"]);
	m = new Minimap({
		"x": 0,
		"y": 0
	}, {
		"x": 100,
		"y": 100
	}, b);
	renderer.setup(start);
};
function start(){
	console.log("Textures loaded!");
	$("#" + window.renderer.element).focus();
	requestAnimationFrame(gameLoop);
}
function gameLoop(timeStamp) {
	let changeInTime = (timeStamp - lastFrameTime);
	lastFrameTime = timeStamp;
	update(changeInTime);
	render();
	requestAnimationFrame(gameLoop);
}

function update(time) {
	window.gameState.update(time);
}

function render() {
	renderer.addToRenderQueue(window.gameState.render());
	renderer.addToRenderQueue(c.render());
	renderer.render();
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
