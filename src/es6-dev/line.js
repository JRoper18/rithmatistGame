import Unit from './unit.js';
import RenderedElement from './renderedElement.js';

export default class Line extends Unit {
	constructor(point1, point2, id, player) {
		super("Line", id, player, point1, {
			"MaxHealth": 50,
			"Health": 50,
			"Tags": [
        "Destructible",
        "Hidden"
      ]
		});
		this.Point1 = point1;
		this.Point2 = point2;
	}
	render() {
		let renderString = "<line x1=\"" + this.Point1.X + "\" y1=\"" + this.Point1.Y + "\" x2=\"" + this.Point2.X + "\" y2=\"" + this.Point2.Y + "\" stroke-width=\"1\" stroke=\"black\"/>";
		let element = new RenderedElement(
			renderString,
			"Line"
		);
		return [element];
	}
}
