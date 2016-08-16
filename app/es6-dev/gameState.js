import * as coord from './coord.js';
import Point from './point.js'
import Rune from './rune.js';
import Circle from './circle.js';
import {Testling} from './chalklings.js'
import * as SAT from '../../node_modules/sat'
import Chalkling from './chalkling.js'
import Line from './line.js'
import RenderedElement from './renderedElement.js'
import SelectedOverlay from './selectedOverlay.js'

export default class GameState{
  constructor(element){
    this.Element = element;
    this.Contains = [new Testling(1, "red", new Point(300, 0)), new Circle([new Point(100,0,1), new Point(170,39, 1), new Point(200, 100, 1), new Point(170, 170, 1), new Point(100, 200, 1), new Point(39, 170, 1), new Point(0, 100, 1), new Point(39, 39, 1), new Point(100,0,1)
    ], 2, "red")];
    this.Selected = [];
    this.Contains[0].moveTo(new Point(300, 300))
    this.Contains[1].moveTo(new Point(300, 600));
    this.IDGenerator = this.getId();
    this.Contains.push(new Testling(42, "red", new Point(300, 100)))
  }
  *getId(){
      let index = 3;
      while(true){
        yield index++;
      }
  }
  getCircles(){
    let circles = []
    this.getBinded((rune) =>{
      if(rune.constructor.name == "Circle"){
        circles.push(rune)
      }
    })
    return circles;
  }
  newCircle(circle){
    let allCircles = this.getCircles();
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
    if(mostLikelyCircleError > 50){ //If the error is too high (>50 pixels);
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
        let circle = new Circle(points, this.IDGenerator.next(), "blue");
        this.newCircle(circle);
        break;
      case "attack":
        this.Contains.push(new Testling(this.IDGenerator.next(), team, new Point(coord.Centroid(points).X, coord.Centroid(points).Y)));
        break;
      case "line":
        let distance = coord.Distance(points[0], points[1])
        let lines = []
        for(let i = 0; i<distance/10;i++){
          let point1 = coord.movePointAlongLine(points[0], points[1], i * 10)
          let point2 = coord.movePointAlongLine(points[0], points[1], (i + 1) * 10)
          let line = new Line(point1, point2, this.IDGenerator.next(), team)
          lines.push(line)
          //TODO: Don't just push it randomly
          this.Contains.push(line);
        }
        //TODO: Check the first, last, and middle lines to circle bind points and then bind them.
        break;
      default:

    }
  }
  moveSelectedAlongPath(path){
    if(this.Selected[0] != null){
      for(let i = 0; i<this.Selected.length; i++){
        let currentSelected = this.Selected[i];
        currentSelected.moveAlongPath(path);
      }
    }
  }
  getBinded(callback = function(){}, parent = false){ //depth-first search.
    //If parent is true, the callback will be function(parent, child)
    let binded = [];
    for(let i = 0; i<this.Contains.length;i++){
      this.getBindedIncursion(this.Contains[i], binded, callback, parent);
    }
    return binded;
  }
  getBindedIncursion(rune, binded, callback, parent){
    if(typeof rune.HasBinded != "undefined"){ //has binded stuff, find it recursively
      if(parent){
        callback(rune);
      }
      for(let i = 0; i<rune.HasBinded.length; i++){
        this.getBindedIncursion(rune.HasBinded[i], binded, callback, parent);
      }
      binded.push(rune)
    }
    else{
      binded.push(rune)
    }
    if(!parent){
      callback(rune);
    }
  }
  removeDeadChalklings(){
    this.getBinded((rune) => {
      if(this.isChalkling(rune)){
        if(rune.CurrentAction == "DEATH"){
          this.Contains.splice(this.Contains.indexOf(rune), 1); //If the chalkling is dead, removes is from board.
          this.Selected.splice(this.Contains.indexOf(rune), 1); //Also, make sure you unselect it.
        }
      }
    })
  }
  updateChalklingView(){ //Updates what each chalkling can see.
    let runes = this.getBinded();
    for(let j = 0; j<runes.length; j++){
      let newSees = []
      for(let k = 0; k<runes.length; k++){
        if(j == k){ //Don't add ourselves to what we see.
          continue;
        }
        if(this.isChalkling(runes[j])){
          let currentDistance = coord.Distance(runes[j].Position, runes[k].Position)
          if(currentDistance<runes[j].Attributes.ViewRange){
            newSees.push(runes[k]);
          }
        }

      }
      runes[j].Sees = newSees;
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
        const BOUNCE = 1.1
        if(entity1.constructor.name == "Circle" || entity2.constructor.name == "Circle"){ //One's a circle
          if(entity1.constructor.name == "Circle" && entity2.constructor.name == "Circle"){ //Both circles

          }
          else if(this.isChalkling(entity1)){ //1 is chalkling, 2 is circle
            if(SAT.testPolygonPolygon(new B(new V(entity1.TopLeft.X, entity1.TopLeft.Y), 100, 100).toPolygon(), entity2.toSATPolygon(), response)){
              entity1.Position.X -= (response.overlapV.x + 1 * BOUNCE)
              entity1.Position.Y -= (response.overlapV.y + 1 * BOUNCE)
              //Stop the chalkling from walking, so it doesn't get stuck there.
              entity1.override();
            }
          }
          else if(this.isChalkling(entity2)){ //2 is chalkling, 1 is circle
            if(SAT.testPolygonPolygon(new B(new V(entity2.TopLeft.X, entity2.TopLeft.Y), 100, 100).toPolygon(), entity1.toSATPolygon(), response)){
              entity2.Position.Y -= (response.overlapV.y  + 1 * BOUNCE)
              entity2.override();
            }
          }
          else{ //It's a circle and something else, do nothing

          }
        }
        else if(this.isChalkling(entity1) && this.isChalkling(entity2)){ //Both are chalklings

          //For now, it's ok for them to overlap. Uncomment if you want them not to.
          /*
          //Create a bounding box around chalkling
          let firstChalklingBox = new B(new V(entity1.TopLeft.X, entity1.TopLeft.Y), 100, 100).toPolygon();
          let secondChalklingBox = new B(new V(entity2.TopLeft.X, entity2.TopLeft.Y), 100, 100).toPolygon();
          let collided = SAT.testPolygonPolygon(firstChalklingBox, secondChalklingBox, response);
          if(collided){
            let collidedVector = response.overlapV.scale(0.5); //How much they overlap
            entity1.Position.X -=collidedVector.x;
            entity1.Position.Y -=collidedVector.y;
            entity2.Position.X +=collidedVector.x;
            entity2.Position.Y +=collidedVector.y;
          }
          */
        }
      }
    }
  }
  removeDeadBindedRunes(runeType){
    for(let j = 0;j<this.Contains.length;j++){
      if(this.Contains[j].constructor.name == runeType){
        if(this.Contains[j].Attributes.Health <= 0){
          this.Contains.splice(j, 1);
        }
      }
    }
    this.getBinded(function(parent){ //This will remove circles that are binded. We also need to check the top-level circles as well (done above).
      for(let i = 0; i<parent.HasBinded.length; i++){
        if(parent.HasBinded[i].Attributes.Health <= 0){
          parent.HasBinded.splice(i, 1);
        }
      }
    }, true)
  }
  selectChalklingAtPoint(point){
    let V = SAT.Vector;
    let B = SAT.Box;
    let vecPoint = new V(point.X, point.Y);
    let chalkling = null;
    this.getBinded((rune) => {
      if(this.isChalkling(rune)){
        if(SAT.pointInPolygon(vecPoint, new B(new V(rune.TopLeft.X, rune.TopLeft.Y), 100, 100).toPolygon())){
          chalkling = rune;
        }
      }
    })
    this.Selected = [chalkling];
  }
  selectChalklingsInRect(point1, point2){
    let V = SAT.Vector;
    let B = SAT.Box;
    let lesserX = (point1.X > point2.X) ? point2.X : point1.X
    let lesserY = (point1.Y > point2.Y) ? point2.Y : point1.Y
    let greaterX = (point1.X < point2.X) ? point2.X : point1.X
    let greaterY = (point1.Y < point2.Y) ? point2.Y : point1.Y
    let selected = []
    this.getBinded((rune) => {
      if(this.isChalkling(rune)){
        let vecPoint = new V(rune.Position.X, rune.Position.Y)
        if(SAT.pointInPolygon(vecPoint, new B(new V(lesserX, lesserY), greaterX-lesserX, greaterY-lesserY).toPolygon())){
          selected.push(rune)
        }
      }
    })
    this.Selected = selected;
  }
  isChalkling(rune){
    if(rune.__proto__ instanceof Chalkling){
      return true
    }
    else{
      return false;
    }
  }
  renderSelected(){
    let selectedArray = []
    for(let i = 0; i<this.Selected.length; i++){
      let currentRunePosition = this.Selected[i].TopLeft
      selectedArray.push(new SelectedOverlay(currentRunePosition))
    }
    return selectedArray;
  }
  update(time){
    this.removeDeadChalklings();
    this.updateHitboxes();
    this.updateChalklingView();
    this.removeDeadBindedRunes("Circle")
    this.removeDeadBindedRunes("Line")
    this.getBinded((rune) => {
      if(typeof rune.update != "undefined"){
        rune.update(time);
      }
    })
  }
  render(){
    let renderedElements = [];
    let allRunes = this.getBinded();
    allRunes = allRunes.concat(this.renderSelected());
    for(let rune of allRunes){
      let runeElements = rune.render();
      for(let i = 0; i<runeElements.length; i++){ //Some render functions return multiple renderedElements, so go through all of them.
        let tempElement = runeElements[i]
        let order = devConfig.renderOrder[tempElement.Type] //Get the render order based on the current rune's type
        if(renderedElements.length == 0){
          renderedElements.push(tempElement)
        }
        else{
          let inserted = false;
          for(let j = 0; j<renderedElements.length;j++){
            let checkedElementOrder = devConfig.renderOrder[renderedElements[j].Type]
            if(order<checkedElementOrder){ //We've searched too far in the array and found people with higher rendering order.
              renderedElements.splice(j, 0, tempElement) //Insert us at the end of our rendering section.
              inserted = true;
              break;
            }
          }
          if(!inserted){ //We are on the top of the rendering queue.
            renderedElements.push(tempElement);
          }
        }
      }
    }
    let renderString = '';
    for(let i = 0; i<renderedElements.length; i++){
      renderString += renderedElements[i].RenderString;
    }
    return renderString;
  }
}
