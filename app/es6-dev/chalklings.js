import Chalkling from './chalkling.js';

export class Testling extends Chalkling{
  constructor(id, player, position){
    super("Testling", id, player, position, {
      "MaxHealth" : 100,
      "Attack" : 10,
      "AttackRange" : 200,
      "MovementSpeed" : 100,
      "ViewRange" : 3000,
      "AnimationData": {
        "IDLE" : {
          "Frames" : 1,
          "Time" : 1
        },
        "WALK" : {
          "Frames" : 1,
          "Time" : 1
        },
        "ATTACK": {
          "Frames" : 1,
          "Time" : 1
        }
      },
      "Tags" : [
        "Mobile",
        "Destructible",
      ]
    })
  }
}
