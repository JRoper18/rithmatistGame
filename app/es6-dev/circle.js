import recognizer from './recognizer';
import Rune from './rune.js';
import * as coord from './coord.js';
import Point from './point.js';

export default class Circle extends Rune{
  constructor(Points, ID){
    super(Points, ID)
    this.Position = new Point(coord.Centroid(this.Points).X, coord.Centroid(this.Points).Y);
    this.Radius = this.averageDistanceFromCenter();
    this.HasBinded = [];
  }
  averageDistanceFromCenter(){
    let distances = 0;
    for(let i = 0; i< this.Points.length; i++){
      distances += coord.Distance(new Point(this.Position.X, this.Position.Y), this.Points[i]);
    }
    let avgDistance = distances/this.Points.length;
    return avgDistance;
  }
  getBinded(object = "Circle"){ //depth-first search to find all objects of type object
    let binded = [];
    this.getBindedIncursion(this, object, binded);
    return binded;
  }
  getBindedIncursion(circle, object, binded){
    if(circle.HasBinded.length != 0){
      for(let i = 0; i<circle.HasBinded.length; i++){
        if(typeof object == "undefined" || circle.HasBinded[i].constructor.name == object || circle.HasBinded[i].constructor.name == "Circle"){
          binded.push(circle.HasBinded[i]);
          this.getBindedIncursion(circle.HasBinded[i], object, binded);
        }
        else{

        }
      }
    }
    else{
      binded.push(circle);
    }
  }
  bindRune(rune){
    this.HasBinded.push(rune);
  }
  renderBinded(){
    let renderString = '';
    let binded = getBinded(this);
    for(let i = 0; i<binded; i++){
      renderString =+ (binded[i].render());
    }
    return renderString;
  }
  render(){ //Render functions return svg path strings
    let radius = this.Radius;
    let r = radius.toString();
    return ("<path fill='none' stroke='black' strokewidth=3 d='M" + this.Position.X + " " + this.Position.Y + "m" + (-1*radius).toString() + " 0a" + r + "," + r + " 0 1,0 " + (radius*2).toString() + ",0" + "a " + r + "," + r + " 0 1,0 " + (radius*-2).toString() + ",0" + "'></path>");
    //Circle formula for paths found here: http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334
  }
}
