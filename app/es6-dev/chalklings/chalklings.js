import Chalkling from '../chalkling/chalkling.js';
import AttributeSet from '../chalkling/attributeSet.js';
import ChalklingCommand from '../chalkling/chalklingCommand.js';
import Point from '../point.js';

export class Testling extends Chalkling{
  constructor(id, player, position){
    super("Testling", id, player, position, new AttributeSet(
      100,
      10,
      1000,
      3000,
      200,
      100
    ))
  }
}
