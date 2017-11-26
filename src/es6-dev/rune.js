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
	makePolygon(polyGraphics){
		polyGraphics.moveTo(this.points[0].x, this.points[0].y);
		for(let i = 1; i<this.points.length; i++){
			const current = this.points[i]
			polyGraphics.lineTo(current.x, current.y);
		}
	}
	render(mode = "FILL") {
		if(this.points.length == 0){
			return [];
		}
		let graphics = new PIXI.Graphics();
		switch (mode) {
			case "FILL":
				graphics.lineStyle(1, 0x000000, 1);
				graphics.beginFill(0xffFF00, 0);
				this.makePolygon(graphics);
				graphics.endFill();
			case "DASH":
				graphics.lineStyle(1, 0x000000, 1);
				graphics.beginFill(0xffFF00, 0);
				this.makePolygon(graphics);
				graphics.endFill();
			case "FADE":
				graphics.lineStyle(1, 0x808080, 1);
				graphics.beginFill(0xffFF00, 0);
				this.makePolygon(graphics);
				graphics.endFill();	
		}
		graphics.x = 0;
		graphics.y = 0;
		return [new RenderedElement(graphics, "Rune")];
	}
}
