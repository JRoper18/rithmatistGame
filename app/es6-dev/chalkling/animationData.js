export default class AnimationData{
  constructor(idle, walk, attack, death, finishers, critical){
    this.Idle = idle;
    this.Walk = walk;
    this.Attack = attack;
    this.Death = death;
    this.Finishers = finishers;
    this.Critical = critical;
  }
}
