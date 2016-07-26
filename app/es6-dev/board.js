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
    ])];
    this.Selected = [this.Contains[0]];

    this.Chalklings = this.getChalklings();
    this.Contains[0].moveTo(new Point(0, 0))
    this.Contains[1].Position.X = 600;
  }
  *getId(){
      let index = 3;
      while(true){
        yield index++;
      }
  }
  newCircle(circle){
    let allCircles = [];
    for(let i = 0; i<this.Contains.length; i++){
      if(this.Contains[i].constructor.name == "Circle"){
        let tempCircles = this.getBinded(function(){}, this.Contains[i]);
        allCircles = allCircles.concat(tempCircles, this.Contains[i]);
      }
    }
    let mostLikelyCircle;
    let mostLikelyCircleError = Infinity;
    for(let i = 0; i<allCircles.length; i++){
      let tempCircle = allCircles[i];
      let currentDistance = coord.Distance(tempCircle, new Point(circle.X, circle.Y));
      let tempCircleError = currentDistance - (circle.Radius + tempCircle.Radius); //Measures to see how close the new circle is to touching the outside of the current one.
      if(tempCircleError < mostLikelyCircleError){                      //The ideal error is 0 (they are perfectly tangent circles)
        mostLikelyCircleError = tempCircleError;
        mostLikelyCircle = tempCircle;
      }
    }
    if(mostLikelyCircleError > 200){ //If the error is too high (>200 pixels);
      //Don't bind it, just make it unbinded.
      this.Contains.push(circle);
    }
    else{ //It's probably binded to the mostLikelyCircle
      mostLikelyCircle.bindRune(circle)
    }
  }
  newRune(name, points){
    switch(name){
      case "circle":
        let circle = new Circle(points);
        this.newCircle(circle);
        break;
      case "attack":
        this.Contains.push(new Testling(this.getId(), "blu", new Point(0, 300)));
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
    for(let i = 0; i<this.Selected.length; i++){
      let currentSelected = this.Selected[i];
      currentSelected.moveAlongPath(path);
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
    if(rune.HasBinded != null){ //has binded stuff, find it recursively
      for(let i = 0; i<rune.HasBinded.length; i++){
        this.getBindedIncursion(rune.HasBinded[i]);
        binded.push(rune.HasBinded[i]);
      }
    }
    binded.push(rune);
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
    let runes = this.getBinded();
    let P = SAT.Polygon; //Shortening for easier typing
    let C = SAT.Circle;
    let V = SAT.Vector;
    let B = SAT.Box;
    for(let i = 0; i<runes.length;i++){
      for(let j = 0; j<runes.length; j++){
        if(i == j){ //Don't want to compare to outselves.
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
            SAT.testCircleCircle(new C(new V(x1, y1), entity1.Radius), new C(new V(x2, y2), entity2.Radius), response);
            let smallerCircle = ((entity1.Radius>= entity2.Radius)? entity2: entity1); //Determines smaller circle
            this.getBinded(function(rune){ //Finds the smaller circle, removes it.
              if(rune.HasBinded != null){
                for(let k = 0; i<rune.HasBinded.length;k++){
                  if(rune.HasBinded[k].ID == smallerCircle.ID){
                    rune.HasBinded.splice(k, 1);
                  }
                }
              }
            });
          }
          else if(entity1.Name != null){ //1 is chalkling, 2 is circle
            if(SAT.testPolygonCircle(new B(new V(x1,y1), 100, 100).toPolygon(), new C(new V(x2, y2), entity2.Radius), response)){
              this.getBinded(function(rune){
                if(rune.ID == entity1.ID){
                  rune.Position.X -= (response.overlapV.x)
                  rune.Position.Y -= (response.overlapV.y)
                }
              });
            }
          }
          else if(entity2.Name != null){ //2 is chalkling, 1 is circle
            if(SAT.testPolygonCircle(new B(new V(x2, y2), 100, 100).toPolygon(), new C(new V(x1, y1), entity1.Radius), response)){
              this.getBinded(function(rune){
                if(rune.ID == entity2.ID){
                  rune.Position.X -=(response.overlapV.x)
                  rune.Position.Y -=(response.overlapV.y)
                }
              })
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
            let collidedVector = response.overlapV.scale(0.5); //How much they overlap
            this.getBinded(function(rune){
              if(entity1.ID == rune.ID){
                rune.Position.X -=collidedVector.x;
                rune.Position.Y -=collidedVector.y;
              }
            });
            this.getBinded(function(rune){
              if(entity2.ID == rune.ID){
                rune.Position.X +=collidedVector.x;
                rune.Position.Y +=collidedVector.y;
              }
            });
          }
        }
      }
    }
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
    let renderString = '';
    for(let i = 0; i<this.Contains.length;i++){
      if(this.Contains[i].constructor.name == "Circle"){
        var binded = this.getBinded(function(){}, this.Contains[i]);
        for(let j = 0; j<binded.length;j++){
          renderString += (binded[j].render());
        }
      }
      renderString += (this.Contains[i].render());
    }
    return renderString;
  }
}
