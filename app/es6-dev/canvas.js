import PDollarRecognizer from './recognizer';
import {allRunes, getUserRunes} from './runeData.js'
import Board from './board.js'
import Rune from './rune.js'
import Point from './point.js'
import * as coord from './coord.js'

export default class Canvas{
  constructor(board, runes){
    this.Board = board;
    this.Runes = runes;
    this.Mode = "COMMAND";
    this.CurrentRune = new Rune([]);
    this.enable();
  }
  disable(){
    $(document).unbind()
    $(this.Board.Element).unbind();
  }
  changeMode(mode){
    this.CurrentRune = new Rune([])
    this.Mode = mode;
    this.disable();
    this.enable();
  }
  enable(){
    console.log("Re-enabled");
    let strokeId = 1;
    let recognizer = new PDollarRecognizer();
    getUserRunes(recognizer, this.Runes);
    let DOM = this.Board.Element;
    let mousePosition = new Point()
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
    if(this.Mode == "COMMAND"){
      $(DOM).on("mousedown", (mouseDownEvent) => {
        mousePosition = this.getMousePosition(mouseDownEvent);
        let newSelected = this.Board.selectChalklingAtPoint(mousePosition);
        this.Board.Selected = [newSelected];
        $(DOM).on("mousemove", (mouseMoveEvent) =>{
          mousePosition = this.getMousePosition(mouseMoveEvent);
          //Add the new point data
          this.CurrentRune.Points.push(new Point(mousePosition.X, mousePosition.Y, strokeId));

        });
      });
      $(DOM).on("mouseup", () => {
        $(DOM).off( "mousemove" );
          this.Board.moveChalklingAlongPath(this.CurrentRune.Points);
          this.CurrentRune = new Rune([])
      });
    }
    else if(this.Mode == "DRAW"){
      $(DOM).on("mousedown", (mouseDownEvent) => {
        $(DOM).on("mousemove", (mouseMoveEvent) =>{
          mousePosition = this.getMousePosition(mouseMoveEvent);
          //Add the new point data
          this.CurrentRune.Points.push(new Point(mousePosition.X, mousePosition.Y, strokeId));
        });
      });
      $(DOM).on("mouseup", () => {
        $(DOM).off( "mousemove" );

        let recognizedResult = recognizer.Recognize(this.CurrentRune.Points);
        //WARNING Recognize adds 99-98 more randon points to a point array, which is why I made a clone of of the points and then recognized the clone.
        if(recognizedResult.Score > 0.1){ //If they just drew something
          this.Board.newRune(recognizedResult.Name, this.CurrentRune.Points, "blue");
          this.CurrentRune = new Rune([]);
        }
        strokeId++;
      })
    }
    else if(this.Mode == "STRAIGHTLINE"){
      $(DOM).on("mousedown", (mouseDownEvent) => {
        this.CurrentRune = new Rune([this.getMousePosition(mouseDownEvent)]);
        $(DOM).on("mousemove", (mouseMoveEvent) =>{
          this.CurrentRune.Points[1] = this.getMousePosition(mouseMoveEvent)
        })
      })
      $(DOM).on("mouseup", () => {
        $(DOM).off( "mousemove" );
        this.Board.newRune("line", this.CurrentRune.Points, "blue");
      })
    }
  }
  getMousePosition(event){
    let parentOffset = $(this.Board.Element).offset();
    //Offset allows for containers that don't fit thte entire page and work inside the surface.
    let relX = event.pageX - parentOffset.left;
    let relY = event.pageY - parentOffset.top;
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
      default:
        path = this.CurrentRune.render();
    }
    return path.RenderString;
  }
}
