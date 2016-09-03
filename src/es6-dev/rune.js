import {
	allRunes,
	getRunePoints
} from './runeData.js';
import Point from './point.js';
import * as coord from './coord.js';
import RenderedElement from './renderedElement.js';

export default class Rune { //A Rune is a non-animated (static) set of points
	constructor(points, id) {
		this.points = points;
		this.id = id;
	}
	render(mode = "FILL") {
		let currentStroke = -1;
		let svgPathString = '';
		for (let i = 0; i < this.points.length; i++) {
			if (this.points[i].id != currentStroke) { //If there is a new stroke
				currentStroke = this.points[i].id;
				svgPathString += ("M" + this.points[i].x + " " + this.points[i].y);
			} else {
				svgPathString += ("L" + this.points[i].x + " " + this.points[i].y);
			}
		}
		switch (mode) {
			case "FILL":
				return new RenderedElement('<path stroke="black" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>', "Rune");
			case "DASH":
				return new RenderedElement('<path stroke="black" stroke-dasharray= "5,5" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>', "Rune");
			case "FADE":
				return new RenderedElement('<path stroke="grey" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>', "Rune");
			default:
				return new RenderedElement('<path stroke="black" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>', "Rune");

		}
	}
}
