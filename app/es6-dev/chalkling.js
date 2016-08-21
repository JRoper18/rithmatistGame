import * as coord from './coord.js';
import Point from './point.js'
import RenderedElement from './renderedElement.js'
import Unit from './unit.js'

export default class Chalkling extends Unit{
  constructor(name, id, player, position, attributeSet){
    super(name, id, player, position, attributeSet)
    this.CurrentAction = "IDLE";
    this.Frame = 0;
    this.Sees = [];
    this.TimeSinceAnimationStarted = 0;
    this.Target = null;
    this.Path = []
    this.TopLeft = new Point(this.Position.X - 50, this.Position.Y - 50)
  }
  getAnimation(){ //Example path: ./chalklings/Testling/Animations/Idle/X
    let pathToAnimation = '';
    switch(this.CurrentAction){
      /*
      The reason for the frame+1 and parenthesis is because I can take a group of png files, selected them all, and then rename using f2/
      If I put no name in, it names them (1), (2), etc.
       */
      case "IDLE":
        pathToAnimation = './chalklings/' + this.Name + '/Animations/Idle.png';
        break;
      case "WALK":
        pathToAnimation = './chalklings/' + this.Name + '/Animations/Walk.png';
        break;
      case "ATTACK":
        pathToAnimation = './chalklings/' + this.Name + '/Animations/Attack.png';
        break;
      case "DYING":
        pathToAnimation = './chalklings/' + this.Name + '/Animations/Dying.png';
        break;
      case "DEATH":
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
  moveTo(position){
    this.Target = null;
    this.CurrentAction = "WALK";
    this.Path = [position];
  }
  moveAlongPath(path){  //Path is array of points
    this.Target = null;
    this.CurrentAction = "WALK"
    this.Path = path;
  }
  die(){
    this.CurrentAction = "DYING";
    this.Frame = 0;
    this.TimeSinceAnimationStarted = 0;
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
  override(){
    this.CurrentAction = "IDLE";
    this.Path = [];
    this.Frame = 0;
    this.Target = null;
  }
  update(time){
    //Update topleft
    this.TopLeft = new Point(this.Position.X - 50, this.Position.Y - 50)
    //Calculate the current frame.
    let newTime = (this.TimeSinceAnimationStarted + time); //Get the new time since the animation started
    let numFrames = this.Attributes.AnimationData[this.CurrentAction].Frames;
    let animationTime = this.Attributes.AnimationData[this.CurrentAction].Time;
    let framesPerSecond = numFrames/animationTime;
    this.Frame = Math.min(Math.round(newTime * framesPerSecond), numFrames-1) //Don't round up if we're out of frames. The -1 is because we start at frame 0;
    this.TimeSinceAnimationStarted = newTime;

    if(newTime > animationTime){ //Is my animation done?
      if(this.CurrentAction == "ATTACK"){ //So I'm attacking someone and I just finished an attack animation. Should I continue?
        if(this.Target.Attributes.Health > 0){ //My enemy is alive! Time to finish the job.
          this.Target.Attributes.Health -= this.Attributes.Attack;
        }
        else{
          this.CurrentAction = "IDLE";
        }
      }
      else if(this.CurrentAction == "DYING"){
          this.CurrentAction = "DEATH";
      }
      this.Frame = 0;
      this.TimeSinceAnimationStarted = 0;

    }
    if(this.CurrentAction == "DYING" || this.CurrentAction == "DEATH"){
      return;
    }
    if(this.Attributes.Health <= 0 && this.CurrentAction != "DYING"){ //Is it dead?
      this.die();
      return;
    }

    for(let i = 0; i<this.Attributes.Modifiers; i++){ //Can any of it's modifiers be applied?
      let currentModifier = this.Attributes.Modifiers[i];
      if(currentModifier.Condition(this) == true){
        currentModifier.AttributeChange(this);
      }
    }
    if(this.Path.length != 0){ //Am I currently going somewhere?
      let distanceToMove = (time/1000) * this.Attributes.MovementSpeed;
      this.Position = coord.movePointAlongLine(this.Position, this.Path[0], distanceToMove);
      if(coord.Distance(this.Position, this.Path[0]) < distanceToMove){ //Did I make it where I need to go?
        this.Path.shift();
      }
    }
    else{ //Finished my path, go into idle.
      this.CurrentAction = "IDLE"
    }
    if((this.Target == null && this.getNearbyEnemies().length != 0) && this.CurrentAction == "IDLE"){ //Is there a nearby enemy I can attack?
      let nearbyEnemies = this.getNearbyEnemies()
      let closestEnemy = null;
      let closestEnemyDistance = Infinity;
      for(let i = 0; i<nearbyEnemies.length;i++){
        if(nearbyEnemies[i].hasTag("Hidden")){ //Don't bother looking at nearby people if they're hidden.
          continue;
        }
        let currentDistance = coord.Distance(this.Position, nearbyEnemies[i].Position)
        if(currentDistance < closestEnemyDistance){
          closestEnemy = nearbyEnemies[i]
          closestEnemyDistance = currentDistance;
        }
      }
      this.Target = closestEnemy
    }
    if(this.Target != null){ //If there's a target:
      if(this.Target.CurrentAction == "DEATH" || this.Target.Attributes.Health <= 0){ //Whoops, he's dead. Lets not bother him any more.
        this.Target = null;
      }
      else if(coord.Distance(this.Target.Position, this.Position) >= this.Attributes.ViewRange){ //Can i still see the target?
        this.Target = null;
        this.CurrentAction = "IDLE";
      }
      else if(coord.Distance(this.Target.Position, this.Position) <= this.Attributes.AttackRange){ //Should I move to follow my target?
        if(this.CurrentAction != "ATTACK"){ //If we aren't already attacking...
          this.Path = [];
          this.CurrentAction = "ATTACK";
        }
      }
      else{ //Follow him!
        this.CurrentAction = "WALK";
        this.moveTo(this.Target.Position);
      }
    }
  }
  render(){
    //The way we render only a section of the spritesheet is to embed it in another svg and set the viewbox.
    //Other methods here: http://stackoverflow.com/questions/16983442/how-to-specify-the-portion-of-the-image-to-be-rendered-inside-svgimage-tag
    if(this.CurrentAction == "DEATH"){
      return []
    } 
    const totalWidth = this.Attributes.AnimationData[this.CurrentAction].Size.X
    const frameWidth = (totalWidth/this.Attributes.AnimationData[this.CurrentAction].Frames)
    const frameHeight = this.Attributes.AnimationData[this.CurrentAction].Size.Y
    const viewBox = (frameWidth * this.Frame).toString() + " 0 " + frameWidth.toString() + " " + frameHeight.toString()
    const chalklingImage = "<svg x=\"" + this.TopLeft.X + "\" y=\"" + this.TopLeft.Y + "\" width=\"100px\" height=\"100px\" viewBox=\"" + viewBox + "\">" + "<image x=\"0px\" y=\"0px\" width=\"" + totalWidth.toString() + "\" height=\"" + frameHeight + "\" xlink:href=\"" + this.getAnimation() + "\"" + "/></svg>"
    const healthBarOutside = '<rect x="' + (this.TopLeft.X).toString() + '" y="' + (this.TopLeft.Y+110).toString() + '" width="100" height="5" fill="green"/>';
    const healthRatio = Math.max(0, (((this.Attributes.MaxHealth-this.Attributes.Health)/this.Attributes.MaxHealth)*100));
    const healthBarLeft = '<rect x="' + ((this.TopLeft.X) + (100-healthRatio)).toString() + '" y="' + (this.TopLeft.Y+110).toString() + '" width="' + healthRatio.toString() +  '" height="5" fill="red"/>';
    const healthBarTotal = healthBarOutside + healthBarLeft
    return [new RenderedElement(chalklingImage, "ChalklingImage"), new RenderedElement(healthBarTotal, "ChalklingHealth")]
  }
}
