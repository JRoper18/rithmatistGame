import RenderedElement from './renderedElement.js';

export default class SelectedOverlay {
	constructor(position) {
		this.position = position;
	}
	render() {
		return [new RenderedElement("<rect x=\"" + (this.position.x - 5).toString() + "\" y= \"" + (this.position.y - 5).toString() + "\" width = \"110\" height=\"110\" style=\"fill:gold\"/>", "SelectedOutline")];
	}
}
