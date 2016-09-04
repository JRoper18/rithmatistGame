import Unit from './unit.js';
import RenderedElement from './renderedElement.js';

export default class Line extends Unit {
	constructor(point1, point2, id, player) {
		super("Line", id, player, point1, {
			"maxHealth": 50,
			"health": 50,
			"tags": [
        "destructible",
        "hidden"
      ]
		});
		this.point1 = point1;
		this.point2 = point2;
	}
	render() {
		let renderString = "<line x1=\"" + this.point1.x + "\" y1=\"" + this.point1.y + "\" x2=\"" + this.point2.x + "\" y2=\"" + this.point2.y + "\" stroke-width=\"1\" stroke=\"black\"/>";
		let element = new RenderedElement(
			renderString,
			"Line"
		);
		return [element];
	}
}
