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
    let self = this;
    let strokeId = 1;
    let recognizer = new PDollarRecognizer();
    getUserRunes(recognizer, this.Runes);
    let DOM = this.Board.Element;
    $(document).on( "keydown", function(key){
      if(key.which == 90){ //If "z" key held down
        //Clear Points
        self.CurrentRune.Points = [];
      }
      else if(key.which == 49){ //"1" key
        //Set to draw mode
        self.changeMode("DRAW");
      }
      else if(key.which == 50){ //"2" key
        //Set to path mode
        self.changeMode("COMMAND");
      }
    })
    $(DOM).on("mousedown", function(mouseDownEvent){
      if(self.Mode == "COMMAND"){
        let newSelected = self.Board.selectChalklingAtPoint(new Point(mouseDownEvent.pageX, mouseDownEvent.pageY));
        self.Board.Selected = [newSelected];
      }
      console.log("Mouse down");
      $(DOM).on("mousemove", function(mouseMoveEvent){
        let parentOffset = $(DOM).offset();
        //Offset allows for containers that don't fit thte entire page and work inside the surface.
        let relX = mouseMoveEvent.pageX - parentOffset.left;
        let relY = mouseMoveEvent.pageY - parentOffset.top;
        //Add the new point data
        self.CurrentRune.Points.push(new Point(relX, relY, strokeId));
      });
    });
    $(DOM).on("mouseup", function(){
      $(DOM).off( "mousemove" );
      if(self.Mode == "DRAW"){
        let recognizedResult = recognizer.Recognize(self.CurrentRune.Points);
        //WARNING Recognize adds 99-98 more randon points to a point array, which is why I made a clone of of the points and then recognized the clone.
        if(recognizedResult.Score > 0.1){ //If they just drew something
          self.Board.newRune(recognizedResult.Name, self.CurrentRune.Points, "blu");
          self.CurrentRune = new Rune([]);
        }
        strokeId++;
      }
      else if(self.Mode == "COMMAND"){
        self.Board.moveChalklingAlongPath(self.CurrentRune.Points);
        self.CurrentRune = new Rune([])

      }
    });
  }
  render(){
    let path;
    switch(this.Mode){
      case "DRAW":
        path = this.CurrentRune.render();
        break;
      case "COMMAND":
        path = this.CurrentRune.render("PATH");
        break;
      default:
        path = this.CurrentRune.render();
    }
    return path.RenderString;
  }
}
