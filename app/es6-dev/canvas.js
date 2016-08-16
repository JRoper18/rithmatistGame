import PDollarRecognizer from './recognizer';
import {allRunes, getUserRunes} from './runeData.js'
import GameState from './gameState.js'
import Rune from './rune.js'
import Point from './point.js'
import * as coord from './coord.js'

export default class Canvas{
  constructor(board, runes){
    this.GameState = board;
    this.Runes = runes;
    this.Mode = "COMMAND";
    this.CurrentRune = new Rune([]);
    this.StrokeId = 0;
    this.Recognizer = new PDollarRecognizer()
    this.enable();

  }
  changeMode(mode){
    this.CurrentRune = new Rune([])
    this.Mode = mode;
  }
  enable(){
    getUserRunes(this.Recognizer, this.Runes);
    let DOM = '#' + this.GameState.Element;
    $(document).on( "keydown", (key) => {
      if(key.which == 90){ //If "z" key held down
        //Clear Points
        this.CurrentRune.Points = [];
      }
      else if(key.which == 49){ //"1" key
        //Set to draw mode
        this.changeMode("DRAW");
      }
      else if(key.which == 50){ //"2" key
        this.changeMode("COMMAND");
      }
      else if(key.which == 16 && this.Mode == "DRAW"){
        this.changeMode("STRAIGHTLINE");
      }
    })
    $(document).on("keyup", (key) => {
      if(key.which == 16 && this.Mode == "STRAIGHTLINE"){ //Shift
        this.changeMode("DRAW");
      }
    })
    $(DOM).on("mousedown", (mouseDownEvent) => {
      if(mouseDownEvent.button==2 && this.Mode != "SELECTION"){ //Right click
        this.changeMode("SELECTION");
      }
      else if(mouseDownEvent.button==0 && this.Mode == "SELECTION"){ //Left click
        this.changeMode("COMMAND");
      }
      this.doAction(mouseDownEvent, "mousedown")
      $(DOM).on("mousemove", (mouseMoveEvent) => {
        this.doAction(mouseMoveEvent, "mousemove")
      })
    })
    $(DOM).on("mouseup", () => {
      $(DOM).off("mousemove");
      this.doAction(null, "mouseup")
    })
  }
  doAction(passedEvent, type){
    console.log("EEY");
      if(this.Mode == "DRAW"){
        if(type == "mousemove"){
          let mousePosition = this.getMousePosition(passedEvent);
          //Add the new point data
          this.CurrentRune.Points.push(new Point(mousePosition.X, mousePosition.Y, this.StrokeId));
        }
        else if(type == "mouseup"){
          let recognizedResult = this.Recognizer.Recognize(this.CurrentRune.Points);
          //WARNING Recognize adds 99-98 more randon points to a point array, which is why I made a clone of of the points and then recognized the clone.
          if(recognizedResult.Score > 0.1){ //If they just drew something
            this.GameState.newRune(recognizedResult.Name, this.CurrentRune.Points, "blue");
            this.CurrentRune = new Rune([]);
          }
          this.StrokeId++;
        }
      }
      else if(this.Mode == "SELECTION"){
        if(type == "mousedown"){
          this.CurrentRune = new Rune([this.getMousePosition(passedEvent)])
        }
        else if(type == "mousemove"){
          let startPos = this.CurrentRune.Points[0];
          let currentPos = this.getMousePosition(passedEvent)
          this.CurrentRune.Points = [startPos, new Point(startPos.X, currentPos.Y), currentPos, new Point(currentPos.X, startPos.Y), startPos]
        }
        else if(type == "mouseup"){
          this.GameState.selectChalklingsInRect(this.CurrentRune.Points[0], this.CurrentRune.Points[2])
          this.CurrentRune = new Rune([])
        }
      }
      else if(this.Mode == "COMMAND"){
        if(type == "mousedown"){

        }
        else if(type == "mousemove"){
          let mousePosition = this.getMousePosition(passedEvent);
          //Add the new point data
          this.CurrentRune.Points.push(new Point(mousePosition.X, mousePosition.Y, this.StrokeId));
        }
        else if(type == "mouseup"){
          this.GameState.moveSelectedAlongPath(this.CurrentRune.Points);
          this.CurrentRune = new Rune([])
        }
      }
      else if(this.Mode == "STRAIGHTLINE"){
        if(type == "mousedown"){
          this.CurrentRune = new Rune([this.getMousePosition(passedEvent)]);
        }
        else if(type == "mousemove"){
          this.CurrentRune.Points[1] = this.getMousePosition(passedEvent)
        }
        else if(type == "mouseup"){
          this.GameState.newRune("line", this.CurrentRune.Points, "ALKJADLSK");
        }
      }
  }
  getMousePosition(passedEvent){

    let parentOffset = $("#" + this.GameState.Element).offset();
    //Offset allows for containers that don't fit thte entire page and work inside the surface.
    let relX = passedEvent.pageX - parentOffset.left;
    let relY = passedEvent.pageY - parentOffset.top;
    return new Point(relX, relY)
  }
  render(){
    let path;
    switch(this.Mode){
      case "DRAW":
        path = this.CurrentRune.render("FILL");
        break;
      case "COMMAND":
        path = this.CurrentRune.render("DASH");
        break;
      case "SELECTION":
        path = this.CurrentRune.render("FADE")
        break;
      default:
        path = this.CurrentRune.render();
    }
    return path.RenderString;
  }
}
