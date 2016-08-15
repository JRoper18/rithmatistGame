import RenderedElement from './renderedElement.js'

export default class SelectedOverlay{
    constructor(position){
      this.Position = position;
    }
    render(){
      return [new RenderedElement("<rect x=\"" + (this.Position.X-5).toString() + "\" y= \"" + (this.Position.Y-5).toString() + "\" width = \"110\" height=\"110\" style=\"fill:gold\"/>", "SelectedOutline")]
    }
}
