export default class ChalklingCommand{
  constructor(callback, time, endCondition = function(){
    return true;
  }){
    //callback's first parameter is references as the chalkling the command is given to, time is how long the callback takes,
    //if endCondition is met the action ends.
    this.Action = callback;
    this.Time = time;
    this.EndCondition = endCondition;
  }
  override(){
    this.EndCondition = function(){
      return true
    }
    this.Action = function(){
      return;
    }
  }
}
