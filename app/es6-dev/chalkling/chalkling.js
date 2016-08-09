import * as coord from '../coord.js';
import ChalklingCommand from './chalklingCommand.js';

export default class Chalkling{
  constructor(name, id, player, position, attributeSet, animationData){
    this.Name = name;
    this.Player = player;
    this.ID = id;
    this.Position = position;
    this.Attributes = attributeSet;
    this.CurrentAction = "IDLE";
    this.Frame = 0;
    this.Sees = [];
    this.AnimationEnd = -1;
    this.Queue = [];
    this.Target = null;
    this.Path = []
  }
  getAnimation(){ //Example path: ./chalklings/Testling/Animations/Idle/X
    let pathToAnimation = '';
    switch(this.CurrentAction){
      case "IDLE":
        pathToAnimation = './chalklings/' + this.Name + '/Animations/Idle/' + this.Frame + ".png";
        break;
      case "WALK":
        pathToAnimation = './chalklings/' + this.Name + '/Animations/Walk/' + this.Frame + ".png";
        break;
      case "ATTACK":
        pathToAnimation = './chalklings/' + this.Name + '/Animations/Attack/' + this.Frame + ".png";
        break;
      case "DEATH":
        pathToAnimation = './chalklings/' + this.Name + '/Animations/Death/' + this.Frame + ".png";
        break;
      case "FINISHER":
        pathToAnimation = './chalklings/' + this.Name + '/Animations/Finishers/' + this.Target.Name + '/' + this.Frame + ".png";
        break;
      case "CRITICAL":
        pathToAnimation = './chalklings/' + this.Name + '/Animations/Critical/' + this.Frame + ".png";
        break;
      default:
        pathToAnimation = './chalklings/' + this.Name + '/Animations/Idle/' + this.Frame + ".png";
    }
    return pathToAnimation;
  }
  checkQueue(object, chalkling){
    for(let i = 0; i<this.Queue.length;i++){
      if(this.Queue[i].toString() == object.toString()){
        return i;
      }
    }
    return -1;
  }
  doCommand(command, override = false){
    let self = this;
    let promise = new Promise(function(resolve, reject){
      if(!override && self.checkQueue(command, self) != -1){

      }
      else{
        self.Queue.push(command);
        let interval = setInterval(function(){
          if(command.EndCondition(self) == "reject"){
            reject(new Error("Nothing to see here"));
          }
          else if(command.EndCondition(self)){
            clearInterval(interval)
            self.Queue.splice(self.checkQueue(command, self), 1)
            resolve();
          }
          else{
            command.Action(self)
          }
        }, command.Time);
      }
    });
    return promise;
  }
  moveTo(position){
    this.CurrentAction = "WALK";
    this.Target = null;
    let self = this;
    let promise = this.doCommand(new ChalklingCommand(function(chalkling){
      chalkling.Position = coord.movePointAlongLine(chalkling.Position, position, chalkling.Attributes.MovementSpeed/30)
    }, 33, function(chalkling){
        if(coord.Distance(chalkling.Position, position)<10 || chalkling.CurrentAction != "WALK"){
          chalkling.CurrentAction = "IDLE";
          return true;
        }
        else{
          return false;
        }
    }), true);
    return promise;
  }
  moveAlongPath(path, index = 0){  //Path is array of points
    this.override();
    let moveToPromise = this.moveTo(path[index]);
    let self = this;
    if(index != path.length-1){ //We still have more points to goto
      moveToPromise.then(function(){self.moveAlongPath(path, index+1)}).catch(function(error){});
    }
    else{}
  }
  override(){
    for(let i = 0; i<this.Queue.length; i++){
      this.Queue[i].override();
    }
  }
  die(){
    this.CurrentAction = "DEATH";
    console.log("A " + this.Player + " " + this.Name + " has died!");
  }
  getNearbyEnemies(){
    let enemies = [];
    for(let i = 0; i<this.Sees.length; i++){
      if(this.Sees[i].Player != this.Player){
        enemies.push(this.Sees[i]);
      }
    }
    return enemies;
  }
  update(){
    if(this.Attributes.Health == 0){ //1. Is it dead?
      this.die();
      return;
    }
    if(this.Frame == this.AnimationEnd){ //2. Is it's action done?
      if(this.Queue.length != 0){
        this.nextCommand();
      }
      else{
        this.CurrentAction = "IDLE";
      }
      this.Frame = 0;
    }
    for(let i = 0; i<this.Attributes.Modifiers; i++){ //3. Can any of it's modifiers be applied?
      let currentModifier = this.Attributes.Modifiers[i];
      if(currentModifier.Condition(this) == true){
        currentModifier.AttributeChange(this);
      }
    }
    if(this.CurrentAction == "IDLE" && this.getNearbyEnemies().length != 0){ //4. Is there a nearby enemy I can attack?
      this.Target = this.getNearbyEnemies()[0];
    }
    if(this.Target != null){ //If there's a target:
      if(coord.Distance(this.Target.Position, this.Position) >= this.Attributes.ViewRange){ //5. Can i still see the target?
        this.CurrentAction = "IDLE";
      }
      let self = this;
      if(coord.Distance(this.Target.Position, this.Position) <= this.Attributes.AttackRange){ //6. Should I move to follow my target?
        this.CurrentAction = "ATTACK";
        this.doCommand(new ChalklingCommand(function(chalkling){
          chalkling.Target.Attributes.Health -= chalkling.Attributes.Attack;
        }, self.Attributes.AttackRate, function(chalkling){
          if(chalkling.CurrentAction != "ATTACK"){
            return true;
          }
          else{
            return false;
          }
        }))
      }
      else{
        this.CurrentAction = "WALK";
        this.moveTo(this.Target.Position);
      }
    }
  }
  render(){
    this.update();
    let chalklingImage = "<image xlink:href=\""  + this.getAnimation() + "\" x=\"" + (this.Position.X).toString()+ "\" y=\"" + (this.Position.Y).toString() + "\" height=\"100\" width=\"100\" />"
    let healthBarOutside = '<rect x="' + (this.Position.X).toString() + '" y="' + (this.Position.Y+110).toString() + '" width="100" height="5" fill="green"/>';
    let healthRatio = (((this.Attributes.MaxHealth-this.Attributes.Health)/this.Attributes.MaxHealth)*100);
    let healthBarLeft = '<rect x="' + ((this.Position.X) + (100-healthRatio)).toString() + '" y="' + (this.Position.Y+110).toString() + '" width="' + healthRatio.toString() +  '" height="5" fill="red"/>';
    return chalklingImage + healthBarOutside + healthBarLeft;
  }
}
