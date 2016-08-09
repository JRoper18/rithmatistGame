import * as coord from './coord.js';
import Point from './point.js'
import Rune from './rune.js';
import Circle from './circle.js';
import {Testling} from './chalklings/chalklings.js'
import ChalklingCommand from './chalkling/chalklingCommand.js'
export default class Board{
  constructor(element){
    this.Element = element;
    this.Contains = [new Testling(1, "red", new Point(300, 0)), new Circle([new Point(100,0,1), new Point(170,39, 1), new Point(200, 100, 1), new Point(170, 170, 1), new Point(100, 200, 1), new Point(39, 170, 1), new Point(0, 100, 1), new Point(39, 39, 1), new Point(100,0,1)
    ], 2)];
    this.Selected = [];
    this.Chalklings = this.getChalklings();
    this.Contains[0].moveTo(new Point(0, 0))
    this.Contains[1].moveTo(new Point(600, 0));
    this.IDGenerator = this.getId();
  }
  *getId(){
      let index = 3;
      while(true){
        yield index++;
      }
  }
  newCircle(circle){
    let allCircles = [];
    this.getBinded(function(rune){
      if(rune.constructor.name == "Circle"){
        allCircles.push(rune)
      }
    })
    let mostLikelyCircle;
    let mostLikelyCircleError = Infinity;
    for(let i = 0; i<allCircles.length; i++){
      let tempCircle = allCircles[i];
      let currentDistance = coord.Distance(tempCircle.Position, circle.Position);
      let tempCircleError = currentDistance - (circle.Radius + tempCircle.Radius); //Measures to see how close the new circle is to touching the outside of the current one.
      if(tempCircleError < mostLikelyCircleError){                      //The ideal error is 0 (they are perfectly tangent circles)
        mostLikelyCircleError = tempCircleError;
        mostLikelyCircle = tempCircle;
      }
    }
    if(mostLikelyCircleError > 50){ //If the error is too high (>200 pixels);
      //Don't bind it, just make it unbinded.
      this.Contains.push(circle);
    }
    else{ //It's probably binded to the mostLikelyCircle
      let currentToBinded = coord.Distance(circle.Position, mostLikelyCircle.Position);
      let error = currentToBinded - circle.Radius - mostLikelyCircle.Radius;
      circle.moveTo(coord.movePointAlongLine(circle.Position, mostLikelyCircle.Position, error));
      mostLikelyCircle.bindRune(circle)
    }
  }
  newRune(name, points, team){
    switch(name){
      case "circle":
        let circle = new Circle(points, this.IDGenerator.next());
        this.newCircle(circle);
        break;
      case "attack":
        this.Contains.push(new Testling(this.IDGenerator.next(), team, new Point(coord.Centroid(points).X, coord.Centroid(points).Y)));
      default:

    }
  }
  getChalklings(){
    let chalklings = [];
    this.getBinded(function(rune){
      if(rune.Name != null){
        chalklings.push(rune);
      }
    });
    return chalklings;
  }
  moveChalklingAlongPath(path){
    if(this.Selected[0] != null){
      for(let i = 0; i<this.Selected.length; i++){
        let currentSelected = this.Selected[i];
        currentSelected.moveAlongPath(path);
      }
    }
  }
  getBinded(callback = function(){}){ //depth-first search
    let binded = [];
    for(let i = 0; i<this.Contains.length;i++){
      this.getBindedIncursion(this.Contains[i], binded, callback);
    }
    return binded;
  }
  getBindedIncursion(rune, binded, callback){
    if(typeof rune.HasBinded != "undefined"){ //has binded stuff, find it recursively
      for(let i = 0; i<rune.HasBinded.length; i++){
        console.log(rune.HasBinded.length)
        this.getBindedIncursion(rune.HasBinded[i], binded, callback);
      }
      binded.push(rune)
    }
    else{
      binded.push(rune)
    }
    callback(rune);
  }
  removeDeadChalklings(){
    let chalklings = this.Chalklings;
    for(let chalkling of chalklings){
      if(chalkling.CurrentAction == "DEATH"){
        this.Contains.splice(this.Contains.indexOf(chalkling), 1); //If the chalkling is dead, removes is from board.
      }
    }
  }
  updateChalklingView(){ //Updates what each chalkling can see.
    let chalklings = this.Chalklings;
    for(let j = 0; j<chalklings.length; j++){
      for(let k = 0; k<chalklings.length; k++){
        let currentDistance = coord.Distance(chalklings[j].Position, chalklings[k].Position)
        if(currentDistance<chalklings[j].Attributes.ViewRange){
          chalklings[j].Sees.push(chalklings[k]);
        }
      }
    }
  }
  updateHitboxes(){
    let runes = this.getBinded()
    let P = SAT.Polygon; //Shortening for easier typing
    let C = SAT.Circle;
    let V = SAT.Vector;
    let B = SAT.Box;
    for(let i = 0; i<runes.length;i++){
      for(let j = 0; j<runes.length; j++){
        if(i == j){ //Don't want to compare to ourselves.
          continue;
        }
        let response = new SAT.Response();
        let entity1 = runes[i];
        let entity2 = runes[j];
        let x1 = entity1.Position.X;
        let y1 = entity1.Position.Y;
        let x2 = entity2.Position.X;
        let y2 = entity2.Position.Y;
        if(entity1.constructor.name == "Circle" || entity2.constructor.name == "Circle"){ //One's a circle
          if(entity1.constructor.name == "Circle" && entity2.constructor.name == "Circle"){ //Both circles

          }
          else if(entity1.Name != null){ //1 is chalkling, 2 is circle
            if(SAT.testPolygonCircle(new B(new V(x1,y1), 100, 100).toPolygon(), new C(new V(x2, y2), entity2.Radius), response)){
              entity1.Position.X -= response.overlapV.x
              entity1.Position.Y -= response.overlapV.y
              //Stop the chalkling from walking, so it doesn't get stuck there.
              entity1.override();
            }
          }
          else if(entity2.Name != null){ //2 is chalkling, 1 is circle
            if(SAT.testPolygonCircle(new B(new V(x2, y2), 100, 100).toPolygon(), new C(new V(x1, y1), entity1.Radius), response)){
              let moveToPoint = new Point(response.overlapV.x, response.overlapV.y)
              entity2.Position.X -= response.overlapV.x
              entity2.Position.Y -= response.overlapV.y
              entity2.override();
            }
          }
          else{ //It's a circle and something else, do nothing

          }
        }
        else if(entity1.Name != null && entity2.Name != null){ //Both are chalklings
          let x1 = entity1.Position.X;
          let y1 = entity1.Position.Y;
          let x2 = entity2.Position.X;
          let y2 = entity2.Position.Y;
          //Create a bounding box around chalkling
          let firstChalklingBox = new B(new V(x1,y1), 100, 100).toPolygon();
          let secondChalklingBox = new B(new V(x2,y2), 100, 100).toPolygon();
          let collided = SAT.testPolygonPolygon(firstChalklingBox, secondChalklingBox, response);
          if(collided){
            let collidedVector = response.overlapV.scale(0.6); //How much they overlap
            entity1.Position.X -=collidedVector.x;
            entity1.Position.Y -=collidedVector.y;
            entity2.Position.X +=collidedVector.x;
            entity2.Position.Y +=collidedVector.y;
            if(entity1.Player != entity2.Player){ //Shit! We just bumped into an enemy. Drop everything and KILL THEM
              entity1.Target = entity2;
              entity1.override();
              entity2.Target = entity1;
              entity2.override();
            }
          }
        }
      }
    }
  }
  selectChalklingAtPoint(point){
    let V = SAT.Vector;
    let B = SAT.Box;
    let vecPoint = new V(point.X, point.Y);
    let chalkling = null;
    this.getBinded(function(rune){
      if(rune.Name != null){
        if(SAT.pointInPolygon(vecPoint, new B(new V(rune.Position.X, rune.Position.Y), 100, 100).toPolygon())){
          chalkling = rune;
        }
      }
    })
    return chalkling;
  }
  updateChalklingTargetPositions(){
    let chalklings = this.Chalklings;
    for(let i = 0; i<chalklings.length; i++){
      for(let j = 0; j<chalklings.length; j++){
        if(chalklings[i].Target.ID == chalklings[j].ID){
          chalklings[i].Target.Position = chalklings[j].Position;
        }
        else if(chalklings[j].Target.ID == chalklings[i].ID){
          chalklings[j].Target.Position = chalklings[i].Position;
        }
      }
    }
    this.Chalklings = chalklings;
  }
  render(){
    this.Chalklings = this.getChalklings();
    this.removeDeadChalklings();
    this.updateHitboxes();
    this.updateChalklingView();
    let renderString = '' ;
    this.getBinded(function(rune){
      renderString += rune.render();
    })
    return renderString;
  }
}
