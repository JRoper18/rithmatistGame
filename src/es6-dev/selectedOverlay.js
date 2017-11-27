import RenderedElement from './renderedElement.js';

export default class SelectedOverlay {
	constructor(position) {
		this.position = position;
	}
	render() {
		let selectedRect = new PIXI.Graphics();
		selectedRect.beginFill(0xffd700)
		selectedRect.drawRect(this.position.x - 5, this.position.y - 5, 110, 110);
		selectedRect.endFill();
		return [new RenderedElement(selectedRect, "SelectedOutline")];
	}
}
