import {allRunes, getRunePoints} from './runeData.js'
import Point from './point.js'
import * as coord from './coord.js'

export default class Rune{ //A Rune is a non-animated (static) set of points
  constructor(points, id){
    this.Points = points;
    this.ID = id;
  }
  resize(scale){
    let resizedPoints = [];
    for(let i = 0; i<this.Points.length; i++){
      let newX = scale * (this.Points[i].X - this.X) + this.X
      let newY = scale * (this.Points[i].Y - this.Y) + this.Y
      resizedPoints.push(new Point(newX, newY, this.Points[i].ID));
    }
    this.Points = coord.TranslateTo(resizedPoints, coord.Centroid(this.Points));
  }
  render(mode = "DRAW"){
    let currentStroke = -1;
    let svgPathString = '';
    for(let i = 0; i<this.Points.length; i++){
      if(this.Points[i].ID != currentStroke){ //If there is a new stroke
        currentStroke = this.Points[i].ID;
        svgPathString += ("M" + this.Points[i].X + " " + this.Points[i].Y);
      }
      else{
        svgPathString += ("L" + this.Points[i].X + " " + this.Points[i].Y);
      }
    }
    switch(mode){
      case "DRAW":
        return '<path stroke="black" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>'
        break;
      case "PATH":
        return '<path stroke="black" stroke-dasharray= "5,5" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>'
        break;
      default:
        return '<path stroke="black" fill="none" stroke-width = "1" d="' + svgPathString + '"></path>'

    }
  }
}
