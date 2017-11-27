import PDollarRecognizer from './recognizer';
import {
	allRunes,
	getUserRunes
} from './runeData.js';
import GameState from './gameState.js';
import Rune from './rune.js';
import Point from './point.js';
import * as coord from './coord.js';

export default class Canvas {
	constructor(runes) {
		this.runes = runes;
		this.mode = "COMMAND";
		this.currentRune = new Rune([]);
		this.strokeId = 0;
		this.recognizer = new PDollarRecognizer();
		this.enable();
	}
	changeMode(mode) {
		this.currentRune = new Rune([]);
		this.mode = mode;
	}
	enable() {
		getUserRunes(this.recognizer, this.runes);
		let DOM = '#' + window.renderer.element;
		$(DOM).on("keypress", (key) => {
			console.log("KEYDOW");
			if (key.which == 90) { //If "z" key held down
				//Clear Points
				this.currentRune.points = [];
			} else if (key.which == 49) { //"1" key
				//Set to draw mode
				this.changeMode("DRAW");
			} else if (key.which == 50) { //"2" key
				this.changeMode("COMMAND");
			} else if (key.which == 16 && this.mode == "DRAW") {
				this.changeMode("STRAIGHTLINE");
			}
		});
		$(DOM).on("keyup", (key) => {
			if (key.which == 16 && this.mode == "STRAIGHTLINE") { //Shift
				this.changeMode("DRAW");
			}
		});
		$(DOM).on("mousedown", (mouseDownEvent) => {
			if (mouseDownEvent.button == 2 && this.mode != "SELECTION") { //Right click
				this.changeMode("SELECTION");
			} else if (mouseDownEvent.button === 0 && this.mode == "SELECTION") { //Left click
				this.changeMode("COMMAND");
			}
			this.doAction(mouseDownEvent, "mousedown");
			$(DOM).on("mousemove", (mouseMoveEvent) => {
				this.doAction(mouseMoveEvent, "mousemove");
			});
		});
		$(DOM).on("mouseup", () => {
			$(DOM).off("mousemove");
			this.doAction(null, "mouseup");
		});
		console.log(document);
	}
	doAction(passedEvent, type) {
		if (this.mode == "DRAW") {
			if (type == "mousemove") {
				let mousePosition = this.getMousePosition(passedEvent);
				//Add the new point data
				this.currentRune.points.push(new Point(mousePosition.x, mousePosition.y, this.strokeId));
			} else if (type == "mouseup") {
				let recognizedResult = this.recognizer.recognize(this.currentRune.points);
				//WARNING Recognize adds 99-98 more randon points to a point array, which is why I made a clone of of the points and then recognized the clone.
				if (recognizedResult.score < 5) { //If they just drew something
					window.gameState.newRune(recognizedResult.name, this.currentRune.points, "blue");
					this.currentRune = new Rune([]);
				}
				this.strokeId++;
			}
		} else if (this.mode == "SELECTION") {
			if (type == "mousedown") {
				this.currentRune = new Rune([this.getMousePosition(passedEvent)]);
			} else if (type == "mousemove") {
				let startPos = this.currentRune.points[0];
				let currentPos = this.getMousePosition(passedEvent);
				this.currentRune.points = [startPos, new Point(startPos.x, currentPos.y), currentPos, new Point(currentPos.x, startPos.y), startPos];
			} else if (type == "mouseup") {
				window.gameState.selectChalklingsInRect(this.currentRune.points[0], this.currentRune.points[2]);
				this.currentRune = new Rune([]);
			}
		} else if (this.mode == "COMMAND") {
			if (type == "mousedown") {

			} else if (type == "mousemove") {
				let mousePosition = this.getMousePosition(passedEvent);
				//Add the new point data
				this.currentRune.points.push(new Point(mousePosition.x, mousePosition.y, this.strokeId));
			} else if (type == "mouseup") {
				window.gameState.moveSelectedAlongPath(this.currentRune.points);
				this.currentRune = new Rune([]);
			}
		} else if (this.mode == "STRAIGHTLINE") {
			if (type == "mousedown") {
				this.currentRune = new Rune([this.getMousePosition(passedEvent)]);
			} else if (type == "mousemove") {
				this.currentRune.points[1] = this.getMousePosition(passedEvent);
			} else if (type == "mouseup") {
				window.gameState.newRune("line", this.currentRune.points, "ALKJADLSK");
			}
		}
	}
	getMousePosition(passedEvent) {
		let parentOffset = $("#" + window.renderer.element).offset();
		//Offset allows for containers that don't fit thte entirepage and work inside the surface.
		let relX = passedEvent.pageX - parentOffset.left;
		let relY = passedEvent.pageY - parentOffset.top;
		return new Point(relX, relY);
	}
	render() {
		let path;
		switch (this.mode) {
			case "DRAW":
				path = this.currentRune.render("FILL");
				break;
			case "COMMAND":
				path = this.currentRune.render("DASH");
				break;
			case "SELECTION":
				path = this.currentRune.render("FADE");
				break;
			default:
				path = this.currentRune.render();
		}
		return path;
	}
}
