console.log(`hello world from ${__dirname}`);
import Canvas from './es6-dev/canvas.js';
import Board from './es6-dev/board.js'
import Circle from './es6-dev/circle.js'
import {getUserRunes} from './es6-dev/runeData.js';
window.onload = function(){
  var b = new Board('#content');
  var c = new Canvas(b, ["circle", "attack"]);
  let i = 0;
  setTimeout(function(){
    setInterval(function(){
      var svgElements = "<svg width='100%' height='100%'>" + b.render() + c.render() + "</svg>";
      $(b.Element).empty();
      $(b.Element).append(svgElements);
      i++;
    }, 30)
  }, 0)


}
