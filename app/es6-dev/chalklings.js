import Chalkling from './chalkling/chalkling.js';

export class Testling extends Chalkling{
  constructor(id, player, position){
    super("Testling", id, player, position, {
      "MaxHealth" : 100,
      "Attack" : 300,
      "AttackRange" : 200,
      "MovementSpeed" : 100,
      "ViewRange" : 3000
    })
  }
}
