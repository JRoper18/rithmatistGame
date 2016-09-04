export default class Minimap {
	constructor(position, size, gamestate) {
		this.position = position;
		this.size = size;
		this.game = gamestate;
	}
	render() {
		const SCALEX = this.size.x / this.game.size.x;
		const SCALEY = this.size.y / this.game.size.y;
		let innerUnitSVGString = ''
		this.game.getBinded((unit) => {
			innerUnitSVGString += "<rect x=\"" + (unit.position.x * SCALEX).toString() + "\" y = \"" + (unit.position.y * SCALEY).toString() + "\" width=\"5\" height=\"5\" />";
		});
		return `<svg x=\"${this.position.x}\" y=\"${this.position.y}\"width=\"${this.size.x}\" height=\"${this.size.y}\">${innerUnitSVGString}</svg>`;
	}
}
